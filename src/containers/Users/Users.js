import React, {Component} from 'react';
import axios from '../../axios';
import Aux from '../../hoc/Auxiliary';
import User from '../../components/User/User';
import ChangeUsers from '../../components/ChangeUsers/ChangeUsers';
import {Table,
    TableHead,
    TableRow,
    TableCell} from '@material-ui/core';

class Users extends Component {
    constructor(props){
        super(props)
        this.state = {
            users: [],
            name: '',
            email: '',
            phone: '',
            fake: false,
            error: false
        }
    }

    componentDidMount () {
        axios.get('/users')
            .then(response => {
                // const users = response.data.slice(0, 2);
                const users = response.data;
                const userList = users.map(user => {
                    return {
                        ...user,
                        fake: false
                    }
                })
                this.setState({users: userList});
            })
            .catch(error => {
                this.setState({error: true});
            });
    }

    createHandler = (props) => {
        props.id = this.state.users.length + 1;
        const newUser = {...props, fake: true}
        const updatedUsers = this.state.users.concat(newUser);
        axios.post('/users/', props)
            .then(response => {
                this.setState({users: updatedUsers});
            })
            .catch(error => {
                this.setState({error: true});
            });
    }

    updateMappingHandler = (id) => {
        let userData = this.state.users.find(data => {
            return data.id === id;
        })
        this.setState({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            fake: userData.fake
        })
    }

    updateHandler = (props) => {
        console.log(props)
        // if(!userData.fake){
        //     console.log('nope') 
            // axios.put('/users/' + props.id, props)
            //     .then(response => {
            //         console.log(response)
            //     })
            //     .catch(error => {
            //         this.setState({error: true});
            //     });
        // } else {
        //     console.log('fake') 
        // }
    }

    deleteHandler = (id) => {
        axios.delete('/users/' + id)
            .then(response => {
                this.setState(prevState => {
                    const users = prevState.users.filter(user => user.id !== id);
                    return {users}
                })
            })
            .catch(error => {
                this.setState({error: true});
            });
    }

    render () {
        let users = <p style={{textAlign: 'center'}}>Something went wrong!</p>
        if(!this.state.error) {
            users = this.state.users.map(user => {
                return (
                    <User 
                        key={user.id}
                        data={user}
                        deleteHandler={this.deleteHandler}
                        updateHandler={this.updateMappingHandler} />
                );
            })
        }
        return (
            <Aux>
                <ChangeUsers 
                    fake={this.state.fake}
                    name={this.state.name}
                    email={this.state.email}
                    phone={this.state.phone}
                    updateHandler={this.updateHandler}
                    createHandler={this.createHandler} />
                <Table aria-label="customized table">
                    <TableHead>
                      <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>NAME</TableCell>
                          <TableCell>EMAIL</TableCell>
                          <TableCell>CONTACT#</TableCell>
                          <TableCell>ACTION</TableCell>
                      </TableRow>
                    </TableHead>
                        {users}
                </Table>
            </Aux>
        );
    }

}

export default Users;