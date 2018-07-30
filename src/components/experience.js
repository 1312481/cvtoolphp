import React, { Component } from "react";
import pencil from "../assets/images/pencil.svg";
import deleteImage from "../assets/images/delete.svg";
import plus from "../assets/images/plus.svg";
import { connect } from "react-redux";
import * as actions from "../actions/profile";
import "../assets/styles/education.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide } from "react-toastify";
import POSTAPI from "./postAPI";
import POSTAPIDATA from './postAPIData'


class Experience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectNameEdited: [],
      projectDurationEdited: [],
      projectPositionEdited: [],
      projectDescriptionEdited: [],
      projectTechnologyEdited: [],
      projectResEdited: [],
      experience: []
    };
  }

  componentWillMount() {
    const { currentVersions } = this.props.version;
    let projectResTemp = [];
    let projectTemp = [];
    for (let i = 0;
      i <
      this.props.profile[currentVersions].data.experience.length;
      i++
    ) {
      let tempRes = [];

      for (
        let j = 0;
        j <
        this.props.profile[currentVersions].data.experience[i].responsibility.length;
        j++
      ) {
        tempRes.push(false);
      }
      projectTemp.push(false);
      projectResTemp.push(tempRes);
    }
    this.setState({
      projectResEdited: projectResTemp,
      projectNameEdited: projectTemp,
      projectDurationEdited: projectTemp,
      projectPositionEdited: projectTemp,
      projectDescriptionEdited: projectTemp,
      projectTechnologyEdited: projectTemp,
      experience:
        this.props.profile[currentVersions].data.experience
    });

  }
  componentWillReceiveProps(nextProps){
    const { currentVersions } = nextProps.version;
    let projectResTemp = [];
    let projectTemp = [];
    for (let i = 0;
      i <
      nextProps.profile[currentVersions].data.experience.length;
      i++
    ) {
      let tempRes = [];

      for (
        let j = 0;
        j <
        nextProps.profile[currentVersions].data.experience[i].responsibility.length;
        j++
      ) {
        tempRes.push(false);
      }
      projectTemp.push(false);
      projectResTemp.push(tempRes);
    }
    this.setState({
      projectResEdited: projectResTemp,
      projectNameEdited: projectTemp,
      projectDurationEdited: projectTemp,
      projectPositionEdited: projectTemp,
      projectDescriptionEdited: projectTemp,
      projectTechnologyEdited: projectTemp,
      experience: nextProps.profile[nextProps.version.currentVersions].data.experience
    })
  }
  experienceEditing(index, field, resIndex) {
    if (typeof resIndex === "number") {
      let temp = { ...this.state.projectResEdited };
      temp[index][resIndex] = !temp[index][resIndex];
      this.setState({ projectResEdited: temp });
    } else {
      let temp = [...this.state[field]];
      temp[index] = !temp[index];
      let newstate = {};
      newstate[field] = temp;
      this.setState(newstate);
    }
  }

  updateFieldData(e, field, fieldName, index, resIndex) {
    const { currentVersions } = this.props.version;
    let value = { ...this.props.profile[currentVersions]  };
    let user = sessionStorage.getItem("user");

    if (e.key === "Enter") {
      if (typeof resIndex === "number") {
        value.data.experience[
          index
        ].responsibility[resIndex] =
          e.target.value;
        let temp = { ...this.state.projectResEdited };
        temp[index][resIndex] = !temp[index][resIndex];
        this.setState({ projectResEdited: temp });
      } else {
        value.data.experience[index][fieldName] =
          e.target.value;
        let temp = [...this.state[field]];
        temp[index] = !temp[index];
        this.setState({ [field]: temp });
      }
      POSTAPIDATA('http://localhost/cvtoolbackendphp/api/updatedata.php', value.data,value.tagName,user);
      this.props.profileUpdate(value,this.props.version.currentVersions);
    }
  }

  experienceDeleting(index, resIndex) {
    const { currentVersions } = this.props.version;
    let value = { ...this.props.profile[currentVersions] };
    let user = sessionStorage.getItem("user");

    if (typeof resIndex === "number") {
      if (window.confirm("Do you really want to delete this ?!?!")) {
        value.data.experience[
          index
        ].responsibility.splice(resIndex, 1);
      }
    } else {
      if (window.confirm("Do you really want to delete this ?!?!")) {
        value.data.experience.splice(index, 1);
      }
    }
    POSTAPIDATA('http://localhost/cvtoolbackendphp/api/updatedata.php', value.data,value.tagName,user);
    this.props.profileUpdate(value,this.props.version.currentVersions);
  }

  experienceAdding(resIndex) {
    let defaultName = "";
    const { currentVersions } = this.props.version;
    let user = sessionStorage.getItem("user");
    if (typeof resIndex === "number") {
      let value = { ...this.props.profile[currentVersions] };
      value.data.experience[
        resIndex
      ].responsibility.push(defaultName);
      POSTAPIDATA('http://localhost/cvtoolbackendphp/api/updatedata.php', value.data,value.tagName,user);
      this.props.profileUpdate(value,this.props.version.currentVersions);
      toast.success("Adding Responsibility Success!!!!", {
        autoClose: 2000
      });
    } else {
      let tempExp = {};
      tempExp.position = defaultName;
      tempExp.companyName = defaultName;
      tempExp.projectName = defaultName;
      tempExp.projectDescription = defaultName;
      tempExp.technicalSkills = defaultName;
      tempExp.time = defaultName;
      tempExp.responsibility = [defaultName, defaultName];
      let projectResEditedTemp = [...this.state.projectResEdited];
      projectResEditedTemp.push([false, false]);
      this.setState({ projectResEdited: projectResEditedTemp })
      let value = { ...this.props.profile[currentVersions]  };
      value.data.experience.push(tempExp);
      POSTAPIDATA('http://localhost/cvtoolbackendphp/api/updatedata.php', value.data,value.tagName,user);
      this.props.profileUpdate(value,this.props.version.currentVersions);

      toast.success("Adding Experience Success!!!!", {
        autoClose: 2000
      });
    }
  }
  handleChange(e, exp, field, fieldName, index, resIndex) {
    if (fieldName === "responsibility") {
      let temp = [...this.state.experience[index][fieldName]];
      temp[resIndex] = e.target.value;
      let expTemp = [...this.state.experience];
      expTemp[index][fieldName][resIndex] = temp[resIndex];

      this.setState({
        experience: expTemp
      });
    } else {
      let temp = [...this.state.experience];
      temp[index][fieldName] = e.target.value;
      this.setState({
        experience: temp
      });
    }
  }

  renderProperExperienceInput(exp, field, fieldName, index) {
    return this.state[field][index] ? (
      <td>
        <input
          className="inputChange form-control"
          type="text"
          onKeyDown={e => this.updateFieldData(e, field, fieldName, index)}
          value={this.state.experience[index][fieldName]}
          onChange={e => this.handleChange(e, exp, field, fieldName, index)}
        />
      </td>
    ) : (
        <td >
          {exp[fieldName]}
          <img
            onClick={() => this.experienceEditing(index, field)}
            className="iconEdit"
            src={pencil}
            alt="pencil"
          />
        </td>
      );
  }

  renderExperienceContainer() {
    return (

      <div>
        <ToastContainer transition={Slide} newestOnTop />
        <div className=" maincontent">
          <div className="maincontent__header">
            Experience
            <img
              onClick={() => this.experienceAdding()}
              className="iconEdit"
              src={plus}
              alt="plus"
            />

          </div>
        </div>
        {this.props.profile[this.props.version.currentVersions].data.experience.map(
          (exp, index) => {
            return (
              <div className="maintable" key={"experience" + index}>
                <table>
                  <thead>
                    <tr className="table-custom">
                      <th scope="col">
                        Project
                        <img
                          onClick={() => this.experienceDeleting(index)}
                          className="iconEdit"
                          src={deleteImage}
                          alt="delete"
                        />
                      </th>

                      {this.renderProperExperienceInput(
                        exp,
                        "projectNameEdited",
                        "projectName",
                        index
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Time</td>
                      {this.renderProperExperienceInput(
                        exp,
                        "projectDurationEdited",
                        "time",
                        index
                      )}
                    </tr>
                    <tr>
                      <td>Position</td>
                      {this.renderProperExperienceInput(
                        exp,
                        "projectPositionEdited",
                        "position",
                        index
                      )}
                    </tr>
                    <tr>
                      <td>Description</td>

                      {this.renderProperExperienceInput(
                        exp,
                        "projectDescriptionEdited",
                        "projectDescription",
                        index
                      )}
                    </tr>

                    <tr>
                      <td>
                        My Responsibility
                        <img
                          onClick={() => this.experienceAdding(index)}
                          className="iconEdit"
                          src={plus}
                          alt="plus"
                        />
                      </td>
                      <td>
                        <ul>
                          {this.props.profile[
                            this.props.version.currentVersions
                          ].data.experience[index].responsibility.map(
                            (res, resIndex) => {
                              return (
                                <li
                                  key={
                                    exp.toString() +
                                    index.toString() +
                                    resIndex.toString()
                                  }
                                >
                                  {this.state.projectResEdited[index][
                                    resIndex
                                  ] ? (
                                      <input
                                        className="inputChange form-control"
                                        type="text"
                                        onKeyDown={e =>
                                          this.updateFieldData(
                                            e,
                                            "projectResEdited",
                                            "responsibility",
                                            index,
                                            resIndex
                                          )
                                        }
                                        value={
                                          this.state.experience[index][
                                          "responsibility"][resIndex]

                                        }
                                        onChange={e => {
                                          this.handleChange(
                                            e,
                                            exp,
                                            "projectResEdited",
                                            "responsibility",
                                            index,
                                            resIndex
                                          );
                                        }}
                                      />
                                    ) : (
                                      <div>
                                        {exp.responsibility[resIndex]}
                                        <img
                                          onClick={() =>
                                            this.experienceEditing(
                                              index,
                                              "res",
                                              resIndex
                                            )
                                          }
                                          className="iconEdit"
                                          src={pencil}
                                          alt="pencil"
                                        />
                                        <img
                                          onClick={() =>
                                            this.experienceDeleting(
                                              index,
                                              resIndex
                                            )
                                          }
                                          className="iconEdit"
                                          src={deleteImage}
                                          alt="delete"
                                        />
                                      </div>
                                    )}
                                </li>
                              );
                            }
                            )}
                        </ul>
                      </td>
                    </tr>
                    <tr>
                      <td>Technology</td>
                      {this.renderProperExperienceInput(
                        exp,
                        "projectTechnologyEdited",
                        "technicalSkills",
                        index
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          }
        )}
      </div>
    );
  }

  render() {
    return this.renderExperienceContainer();
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
)(Experience);
