import React from "react";
import { NoLocation } from "./NoLocation";
import { LocationDisplay } from "./LocationDisplay";
import { AddLocation } from "./AddLocation";
import { FacilityTimes } from "./FacilityTimes";
import { initializeDB } from "../Utilities/initializeDB";

export default class LocationCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contentToDisplay: "NoLocation",
      dbInitialized: false,
      facilityData: {},
      predefinedData:{}
    };
  }

  setPredefinedData = data => {
    this.setState({ predefinedData: data });
  }
  checkState = (state, data, type) => {
    if (state === 'AddLocation' && data && type === 'toEditData')
      if (data) this.setPredefinedData(data);

    this.setState({ contentToDisplay: state });
  };

  render() {
    if (!this.state.dbInitialized) {
      initializeDB();
      this.setState({ dbInitialized: true });
    }
  
    let content;
    switch (this.state.contentToDisplay) {
      case "NoLocation":
        content = <NoLocation />;
        break;
      case "LocationDisplay":
        content = <LocationDisplay checkState={this.checkState} />;
        break;
      case "AddLocation":
        content = <AddLocation checkState={this.checkState} facilityData={this.state.facilityData} predefinedData={this.state.predefinedData} />;
        break;
      case "FacilityTimes":
        content = <FacilityTimes checkState={this.checkState} /> ;
        break;
      default:
        content = <NoLocation />;
        break;
    }
    return (
      <div className="main" >
        <div className="df dfSb p10">
          <div className="txtGr m10 fw7">Locations</div>
          <button className="adLoc" onClick={() => this.setState({ contentToDisplay: "AddLocation", predefinedData:{} })} > + Add Location </button>
        </div>
        {content}
      </div>
    );
  }
}
