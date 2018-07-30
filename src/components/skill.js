import React, { Component } from 'react';
import pencil from '../assets/images/pencil.svg'
import deleteImage from '../assets/images/delete.svg'
import { connect } from 'react-redux'
import * as actions from '../actions/profile'
import '../assets/styles/education.css'
import plus from "../assets/images/plus.svg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import POSTAPI from './postAPI'
import POSTAPIDATA from './postAPIData'
class Skill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skillNameEdited: [],
      skillDetailEdited: [],
      skill: [],
    }
  }
  nameSkillEditing(index, field) {
    let temp = [...this.state[field]];
    temp[index] = !temp[index];
    let newstate = {};
    newstate[field] = temp;
    this.setState(newstate);
  }

  componentWillMount() {
    const length = this.props.profile[this.props.version.currentVersions].data.technicalSkill.length;
    let projectResTemp = [];
    for (let i = 0; i <= length; i++) {
      let temp = false;
      projectResTemp.push(temp);
    }
    this.setState({
      skillNameEdited: projectResTemp,
      skillDetailEdited: projectResTemp,
      skill: this.props.profile[this.props.version.currentVersions].data.technicalSkill
    });
  }
  componentWillReceiveProps(nextProps){
    this.setState({ 
      skill: nextProps.profile[nextProps.version.currentVersions].data.technicalSkill
    })
  }
  updateFieldData(e, field, fieldName, index) {
    if (e.key === "Enter") {
      let value = { ...this.props.profile[this.props.version.currentVersions]  };
      let user = sessionStorage.getItem("user");
      value.data.technicalSkill[index][fieldName] = e.target.value;
      let temp = [...this.state[field]];
      temp[index] = !temp[index];
      let newstate = {};
      newstate[field] = temp;
      this.setState(newstate);

      POSTAPIDATA('http://localhost/cvtoolbackendphp/api/updatedata.php', value.data,value.tagName,user);
      this.props.profileUpdate(value,this.props.version.currentVersions);
  

    }


  }
  skillDeleting(index) {
    if (window.confirm("Do you really want to delete this ?!?!")) {
      let value = { ...this.props.profile[this.props.version.currentVersions]  };
      let user = sessionStorage.getItem("user");

      value.data.technicalSkill.splice(index, 1);
      POSTAPIDATA('http://localhost/cvtoolbackendphp/api/updatedata.php', value.data,value.tagName,user);
      this.props.profileUpdate(value,this.props.version.currentVersions);

    }
  }
  skillAdding() {
    let tempSkill = {};
    tempSkill.name = '';
    tempSkill.detail = '';

    let value = { ...this.props.profile[this.props.version.currentVersions]  };
    let user = sessionStorage.getItem("user");
    value.data.technicalSkill.push(tempSkill);

    toast.success('Adding Technical Skills Success!!!!', {
      autoClose: 2000
    });
    POSTAPIDATA('http://localhost/cvtoolbackendphp/api/updatedata.php', value.data,value.tagName,user);
    this.props.profileUpdate(value,this.props.version.currentVersions);


  }
  handleChange(e, field, fieldName, index) {
    let temp = [...this.state.skill];
    temp[index][fieldName] = e.target.value;
    this.setState({
      skill: temp
    })
  }

  renderProperInput(field, fieldName, index) {
    return (
      <td>
        {this.state[field][index] ? (
          <input
            className="inputChange form-control"
            type="text"
            value={this.state.skill[index][fieldName]}
            onChange={e => this.handleChange(e, field, fieldName, index)}
            onKeyDown={e => this.updateFieldData(e, field, fieldName, index)}
          />
        ) : (
            <span className="">
              {this.props.profile[this.props.version.currentVersions].data.technicalSkill[index][fieldName]}

              <img
                onClick={() => this.nameSkillEditing(index, field)}
                className="iconEdit"
                src={pencil}
                alt="pencil"
              />

              <img
                onClick={() => this.skillDeleting(index)}
                className="iconEdit"
                src={deleteImage}
                alt="delete"
              />
            </span>
          )}
      </td>
    )
  }

  renderSkillContainer() {
    return (
      <div>
        <ToastContainer
          transition={Slide}
          newestOnTop
        />
        <div className=" maincontent">
          <div className="maincontent__header">Technical Skill

          </div>
        </div>
        <div className="maintable">
          <table>
            <thead>
              <tr className="table-custom">
                <th scope="col">Skill
                <img
                    onClick={() => this.skillAdding()}
                    className="iconEdit"
                    src={plus}
                    alt="plus"
                  />
                </th>
                <th scope="col">Detail</th>
              </tr>
            </thead>
            <tbody>

              {this.props.profile[this.props.version.currentVersions].data.technicalSkill.map((tech, index) => {
                return (

                  <tr key={'skill' + index}>
                    {this.renderProperInput("skillNameEdited", "name", index)}
                    {this.renderProperInput("skillDetailEdited", "detail", index)}

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>)
  }



  render() {
    return this.renderSkillContainer();
  }
}




const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    version: state.version,
    isProfileError: state.isProfileError,
    isProfileLoaded: state.isProfileLoaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    profileUpdate: (profile, version) => dispatch(actions.updateProfileData(profile, version))
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Skill);
