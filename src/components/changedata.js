import React, { Component } from 'react';
import '../assets/styles/changedata.css'
import { connect } from 'react-redux'
import * as actions from '../actions/profile'
import Error from './error';
import Loading from './loading';
import pencil from '../assets/images/pencil.svg';
import POSTAPI from './postAPI'
import POSTAPIDATA from './postAPIData'
class ChangeData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: [],
            version: [],
            showMenu: false,
            user: "",
            tagName: '',
            data: [],
            timeOutId: ''
        }
    }
    componentWillMount() {
        let user = sessionStorage.getItem("user");

        this.setState({ user: user });
        const length = this.props.version.numberOfVersions;
        var a = false;
        var temp = [];
        for (let i = 0; i <= length; i++) {
            temp.push(a)
        }
        this.setState({ edit: temp })
        this.setState({ data: this.props.profile })
        this.setState({ tagName: this.props.profile[this.props.version.currentVersions].tagName })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ tagName: this.props.profile[nextProps.version.currentVersions].tagName })
    }

    increment() {
        this.props.versionIncrement();
    }
    decrement() {
        this.props.versionDecrement();
    }
    showMenu() {
        this.setState({ showMenu: !this.state.showMenu });
    }
    changeProfile(index) {
        this.props.changeVersion(index);
        this.setState({ showMenu: !this.state.showMenu });
    }
    handleKeyNamePress(e, pro, index) {
        if (e.key === 'Enter') {
            let value = { ...this.props.profile[this.props.version.currentVersions] };
            let oldversion = sessionStorage.getItem("tagname");
            let user = sessionStorage.getItem("user");
            value.tagName = e.target.value;
            let temp = [...this.state.edit];
            temp[index] = !temp[index];
            this.setState({ edit: temp });
            POSTAPIDATA('http://localhost/cvtoolbackendphp/api/changetagname.php', e.target.value, this.state.tagName, user);
            this.props.profileUpdate(value, index);

        }
    }
    handleChange(e, index) {
        let temp = [...this.state.data];
        temp[index]["tagName"] = e.target.value;
        this.setState({
            data: temp
        })
    }
    editing(index) {
        let temp = [...this.state["edit"]];
        temp[index] = !temp[index];
        this.setState({ edit: temp })
    }
    onBlurHandler() {
        this.timeOutId = setTimeout(() => {
            this.setState({
                showMenu: false
            });
        });
    }

    // If a child receives focus, do not close the popover.
    onFocusHandler() {
        clearTimeout(this.timeOutId);
    }
    render() {

        if (this.props.isProfileError) {

            return <Error />
        }
        else if (!this.props.isProfileLoaded) {

            return <Loading />
        }
        else return (

            <div className="changeData">
                <div>
                    <div>
                        <div className="changeData__title">
                            Username:
                        </div>
                        <div className="changeData__username">

                            {this.state.user}
                        </div>
                    </div>
                    <div onBlur={() => this.onBlurHandler()}
                        onFocus={() => this.onFocusHandler()}>
                        Choose Version:
                        <button className="btn btn-secondary dropdown-toggle customButton" aria-haspopup="true"
                            aria-expanded={this.state.showMenu} onClick={() => this.showMenu()}>
                            {this.props.profile[this.props.version.currentVersions].tagName}
                        </button>
                        {this.state.showMenu ? (
                            <div className={(this.state.showMenu ? 'menu' : null)}>
                                {
                                    this.state.showMenu ?
                                        (
                                            this.props.profile.map((pro, index) => {
                                                return (
                                                    <div key={"profile" + index}>
                                                        {this.state.edit[index] ?
                                                            (<div key={"divinput" + index}>
                                                                <input key={"input" + index} className="inputChange form-control"
                                                                    value={this.state.data[index].tagName}
                                                                    onChange={(e) => this.handleChange(e, index)}
                                                                    onKeyDown={(e) => this.handleKeyNamePress(e, pro, index)} />
                                                            </div>) :
                                                            (
                                                                <div>
                                                                    <div>
                                                                        <div className="dropdown-item-custom" key={"pro" + index}

                                                                            onClick={() => this.changeProfile(index)}>
                                                                            Version {index}: {this.props.profile[index].tagName}
                                                                        </div>
                                                                        <div className="imageEditing">
                                                                            <img onClick={() => this.editing(index)} className="iconEdit" src={pencil} alt="pencil" key={"image" + index} />
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                )
                                            })
                                        ) :
                                        (
                                            null
                                        )
                                }
                            </div>
                        ) : null}

                    </div>


                </div>
            </div>


        );
    }

}

const mapStateToProps = (state) => {
    return {
        profile: state.profile,
        version: state.version,
        isProfileError: state.isProfileError,
        isProfileLoaded: state.isProfileLoaded
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        versionIncrement: (profile) => dispatch(actions.incrementData()),
        versionDecrement: (profile) => dispatch(actions.decrementData()),
        changeVersion: (version) => dispatch(actions.changeVersion(version)),
        profileUpdate: (profile, version) => dispatch(actions.updateProfileData(profile, version))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(ChangeData);