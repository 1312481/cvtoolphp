import React, { Component } from "react";
import pencil from "../assets/images/pencil.svg";
import deleteImage from "../assets/images/delete.svg";
import { connect } from "react-redux";
import * as actions from "../actions/profile";
import plus from "../assets/images/plus.svg";
import "../assets/styles/education.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide} from 'react-toastify';
import POSTAPI from './postAPI'
import POSTAPIDATA from './postAPIData'

class Education extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameEducationEdited: [],
      majorEducationEdited: [],
      graduatedEducationEdited: [],
      education: []
    };


  }

  nameEducationEditing(index, field) {
    let temp = [...this.state[field]];
    temp[index] = !temp[index];
    let newstate = {};
    newstate[field] = temp;
    this.setState(newstate);
  }


  updateFieldData(e, field, fieldName, index) {
    if (e.key === "Enter") {
      let value = { ...this.props.profile[this.props.version.currentVersions]  };
      let user = sessionStorage.getItem("user");
      value.data.education[index][fieldName] = e.target.value;
      let temp = [...this.state[field]];
      temp[index] = !temp[index];
      let newstate = {};
      newstate[field] = temp;
      this.setState(newstate);

      POSTAPIDATA('http://localhost/cvtoolbackendphp/api/updatedata.php', value.data,value.tagName,user);
      this.props.profileUpdate(value,this.props.version.currentVersions);
  

    }

  }

  educationDeleting(index) {
    if (window.confirm("Do you really want to delete this ?!?!")) {
      let value = { ...this.props.profile[this.props.version.currentVersions]  };
      let user = sessionStorage.getItem("user");

      value.data.education.splice(index, 1);
      POSTAPIDATA('http://localhost/cvtoolbackendphp/api/updatedata.php', value.data,value.tagName,user);
      this.props.profileUpdate(value,this.props.version.currentVersions);

    }
   
  }

  educationAdding() {
    let tempEducation = {};
    tempEducation.name = '';
    tempEducation.major = '';
    tempEducation.gradutedTime = '';

    let value = { ...this.props.profile[this.props.version.currentVersions]  };
    let user = sessionStorage.getItem("user");
    value.data.education.push(tempEducation);

    toast.success('Adding Technical Skills Success!!!!', {
      autoClose: 2000
    });
    POSTAPIDATA('http://localhost/cvtoolbackendphp/api/updatedata.php', value.data,value.tagName,user);
    this.props.profileUpdate(value,this.props.version.currentVersions);


 

  }

  componentWillMount() {
    const length = this.props.profile[this.props.version.currentVersions].data.education.length;
    let projectResTemp = [];
    for (let i = 0; i <= length; i++) {
      let temp = false;
      projectResTemp.push(temp);
    }
    this.setState({
      nameEducationEdited: projectResTemp,
      majorEducationEdited: projectResTemp,
      graduatedEducationEdited: projectResTemp,
      education: this.props.profile[this.props.version.currentVersions].data.education
    });


  }
  componentWillReceiveProps(nextProps){
    this.setState({ 
      education: nextProps.profile[nextProps.version.currentVersions].education
    })
  }
  handleChange(e, field, fieldName, index) {
    let temp = [...this.state.education];
    temp[index][fieldName] = e.target.value;
    this.setState({
      education: temp
    })
  }


  renderProperInput(field, fieldName, index) {
    return (
      <td>
        {this.state[field][index] ? (
          <input
            className="inputChange form-control"
            type="text"
            value={this.state.education[index][fieldName]}
            onKeyDown={e => this.updateFieldData(e, field, fieldName, index)}
            onChange={e => this.handleChange(e, field, fieldName, index)}
          />
        ) : (
            <span className="">
              {this.props.profile[this.props.version.currentVersions].data.education[index][fieldName]}

              <img
                onClick={() => this.nameEducationEditing(index, field)}
                className="iconEdit"
                src={pencil}
                alt="pencil"
              />

              <img
                onClick={() => this.educationDeleting(index)}
                className="iconEdit"
                src={deleteImage}
                alt="delete"
              />
            </span>
          )}
      </td>
    );
  }

  renderEducationContainer() {
    return (
      <div>
        <ToastContainer
          transition={Slide}
          newestOnTop
        />
        <div className=" maincontent">
          <div className="maincontent__header">Education</div>
        </div>
        <div className="maintable">
          <table>
            <thead>
              <tr className="table-custom">
                <th scope="col">
                  Name
                  <img
                    onClick={() => this.educationAdding()}
                    className="iconEdit"
                    src={plus}
                    alt={plus}
                  />
                </th>

                <th scope="col">Major</th>
                <th scope="col">Graduated Year</th>
              </tr>
            </thead>
            <tbody>
              {this.props.profile[this.props.version.currentVersions].data.education.map((education, index) => (
                <tr key={"education" + index}>
                  {this.renderProperInput("nameEducationEdited", "name", index)}
                  {this.renderProperInput("majorEducationEdited", "major", index)}
                  {this.renderProperInput("graduatedEducationEdited", "gradutedTime", index)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  render() {
    return this.renderEducationContainer();
  }
}

const mapStateToProps = state => {
  return {
    profile: state.profile,
    version: state.version,
    isProfileError: state.isProfileError,
    isProfileLoaded: state.isProfileLoaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    profileUpdate: (profile, version) => dispatch(actions.updateProfileData(profile, version))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Education);
