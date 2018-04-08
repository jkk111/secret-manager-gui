import React from 'react';
import PasswordModal from './PasswordModal'
import InputModal from './InputModal'
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
    this.refresh = this.refresh.bind(this);
    this.password_set = this.password_set.bind(this);
    this.close_prompt = this.close_prompt.bind(this);
    this.select = this.select.bind(this);
    this.add_secret = this.add_secret.bind(this);
    this.add_file = this.add_file.bind(this);
    this.file_set = this.file_set.bind(this);
  }

  componentDidMount() {
    this.refresher = setInterval(this.refresh, 15000);
    this.refresh();
  }

  componentWillUnmount() {
    clearInterval(this.refresher)
  }

  async refresh() {
    let { password_valid, password, selected } = this.state;
    let resp = await fetch('/files');
    resp = await resp.json();
    this.setState({
      files: resp
    })

    if(password_valid) {
      let body = JSON.stringify({
        password,
        file: selected
      })

      resp = await fetch('/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })

      resp = await resp.json();

      this.setState({
        file_keys: resp
      })
    }
  }

  async load(file, password) {
    console.log(file, password)
    let body = JSON.stringify({
      file,
      password
    })
    let resp = await fetch('/load', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })

    resp = await resp.json();

    if(resp.success === false) {
      if(resp.error) {
        this.setState({
          prompt_password: true,
          password_error: true
        })
      }
    } else {
      this.setState({
        password_valid: true
      }, this.refresh);
    }
  }

  async password_set(password) {
    let { adding_file } = this.state;

    this.setState({
      password,
      prompt_password: false,
      password_valid: false,
      adding_file: false
    })
    if(adding_file) {
      let body = JSON.stringify({
        file: this.state.file,
        password: password
      })

      let resp = await fetch('/touch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })

      resp = await resp.json();
      console.log(resp);

      this.setState({
        password_valid: true
      })

      this.refresh();
      this.load(this.state.file, password)
    } else {
      this.load(this.state.selected, password)
    }
  }

  file_set(file) {
    this.setState({
      file,
      selected: file,
      adding_file: true,
      prompt_file: false,
      prompt_password: true,
      password_valid: false
    })
  }

  close_prompt() {
    this.setState({
      adding_file: false,
      prompt_password: false
    })
  }

  select(file, i) {
    return () => {
      this.setState({
        selected: file,
        prompt_password: true,
        password_valid: false,
        adding_file: false
      })
    }
  }

  async add_secret(e) {
    e.preventDefault();
    let key = e.target.name.value;
    let value = e.target.secret.value;

    let form = e.target;

    let body = JSON.stringify({
      file: this.state.selected,
      password: this.state.password,
      key,
      value
    })

    let resp = await fetch('/set', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })

    console.log(e);

    form.reset();

    resp = await resp.json();
    console.log(resp);

    this.refresh();
  }

  add_file() {
    this.setState({
      prompt_file: true,
      password_valid: false,
      file_keys: [],
      selected: null
    })
  }

  render() {
    let { selected, files = [], prompt_password, prompt_file, file_keys = [], password_valid } = this.state;

    files = files.map((f, i) => {
      let className = 'file'
      if(f === selected) {
        className += ' selected'
      }
      return <div className={className} key={i} onClick={this.select(f)}>
        {f}
      </div>
    })

    file_keys = file_keys.map((k, i) => {
      return <div className='key' key={i}>
        {k}
      </div>
    })

    let secret_class = 'set-secret';
    let secrets_class = 'secret-keys';

    if(!password_valid) {
      secret_class += ' disabled';
      secrets_class += ' disabled';
    }

    return <div className='wrapper'>
      <InputModal open={prompt_file} close={this.close_prompt} submit={this.file_set} />
      <PasswordModal open={prompt_password} file={selected} close={this.close_prompt} submit={this.password_set} />
      <div className='app-layout'>
        <div className='file-list'>
          <h3 className='title'>Files</h3>
          <div className='content-grow'>{files}</div>
          <h3 className='footer-button' onClick={this.add_file}>Add File</h3>
        </div>
        <div className={secret_class}>
          <h3 className='title'>Add Secret</h3>
          <form onSubmit={this.add_secret} className='input-form'>
            <input className='key-input' type="text" name='name' placeholder='Key Name' />
            <textarea className='value-input' name="secret" placeholder='Value' />
            <input className='input-button' type="submit" />
          </form>
        </div>
        <div className={secrets_class}>
          <h3 className='title'>Keys</h3>
          {file_keys}
        </div>
      </div>
    </div>
  }
}

export default App;
