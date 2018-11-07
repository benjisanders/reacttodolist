'use strict';

const DivCol = (props) => {
    return (<div className="col-3">{props.innerText}</div>);
}

class CheckBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...props };
        this.onChangeFunc = this.onChangeFunc.bind(this);
    }

    onChangeFunc() {
        this.state.cbOnChange();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ IsComplete: nextProps.IsComplete });
    }

    render() {
        return (<span><input type="checkbox" onChange={() => { this.onChangeFunc(); }} checked={this.state.IsComplete} /> {this.state.cbValue}</span>);
    }
}

class DeleteButtonForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = { Id: props.Id, reRenderTable: props.reRenderTable }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        axios.delete(`https://localhost:5001/api/Todo/${this.state.Id}`)
            .then(() => {
                this.state.reRenderTable();
            });
    }

    render() {

        return (
            <form onSubmit={this.handleSubmit}>
                <button type="submit">Remove Task</button>
            </form>
        );
    }
}

class ToDoRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...props };
        this.cbUpdateState = this.cbUpdateState.bind(this);
    }

    reRenderTable() {
        this.state.reRenderTable();
    }

    cbUpdateState() {
        this.setState({ IsComplete: !this.state.IsComplete }, () => {
            axios.put(`https://localhost:5001/api/todo/${this.state.Id}`,
                {
                    IsComplete: this.state.IsComplete,
                    Name: this.state.Name
                }).then(() => { this.reRenderTable(); });
        });
    }

    render() {
        return (<div className="row">
            <div className="col-6"><CheckBox IsComplete={this.state.IsComplete} cbOnChange={() => { this.cbUpdateState(); }} cbValue={this.state.Name} /></div>
            <div className="col-6">
                <DeleteButtonForm Id={this.state.Id} reRenderTable={() => { this.reRenderTable(); }} />
            </div>
    </div>);
    }

}

class ToDoTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { divRows : props.rowData };
    }

    //This lifecycle method has does and don'ts and is still under investigation...
    componentWillReceiveProps(nextProps) {
        this.setState({ divRows: nextProps.rowData });
    }

    reRenderTable = () => {
        axios.get('https://localhost:5001/api/Todo')
            .then((resp) => {
                this.setState({ divRows: resp.data });
            });
    }

    render() {
        return (<div>
            <div className="row">
                <div className="col-6">Task Name</div>
                <div className="col-6" />
            </div>
            {this.state.divRows.map(divRow => (
                <ToDoRow {...divRow} reRenderTable={() => { this.reRenderTable(); }} />
                ))}

        </div>);
    }

}

class AddActionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: '', onSubmit: this.props.onSubmit, reFreshTable: this.props.reFreshTable };
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.state.text === '')
            return;

        let text = this.state.text;
        this.setState({ text: '' });

        axios({
            method: 'post',
            url: 'https://localhost:5001/api/Todo/',
            data: {
                Name: text,
                IsComplete: 'false'
            }
        }).then(() => { this.state.reFreshTable(); });


    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    render() {

        return (
            <form onSubmit={this.handleSubmit}>
                <input id="new-todo" onChange={this.handleChange} value={this.state.text} />
                <button type="submit">Add Item</button>
            </form>
        );
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { tableDivRows: props.divRows };
        this.reFreshToDoTable();
    }

    setDivRows = (data) => {
        this.setState(() => ({ tableDivRows: data }));
    }

    reFreshToDoTable() {
        axios.get('https://localhost:5001/api/Todo')
            .then((resp) => {
                this.setState(() => ({ tableDivRows: resp.data }));
            });
    }

    render() {
        return (
            <div>
                <AddActionForm onSubmit={this.setDivRows} reFreshTable={() => { this.reFreshToDoTable() }} />
                <br />
                <ToDoTable rowData={this.state.tableDivRows} />
            </div>
        );
    }
}

ReactDOM.render(<App divRows={[]} />, document.querySelector('#app'));