import React from "react";
import { FacilityTimes } from "./FacilityTimes";

export class AddLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      facilityData: {},
      dataObj: {},
      showFacilityTimes: false
    };
    this.setFacilityTimes=this.setFacilityTimes.bind(this)
  }

  addLoc = () => {
    let that = this;
    let { locnName, addLine1, suiteNum, addLine2, city, state, zipCode, phoneNum, timeZone, facilityTime, appPool } = this.state.dataObj;
    if (!locnName) {
      alert("Location name is mandatory");
      return;
    }
    if (zipCode && (zipCode.length < 5 || zipCode.length > 10 || zipCode.indexOf(' ') > -1)) {
      alert("Invalid Zip Code");
      return;
    }
    if(phoneNum && !(/^([0-9][0-9]?\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$/g).test(phoneNum)){
      alert ('Please enter correct format XX XXX-XXX-XXXX');
      return;
    }

    var request = window.indexedDB.open("LocationDB", 1);

    request.onsuccess = function (event) {
      var db = event.target.result;

      var transaction = db.transaction("locations", "readwrite");

      var locationStore = transaction.objectStore("locations");
      let count = 0;
      locationStore.count().onsuccess = function (event) {
        count = event.target.result;

        let loc = {
          Location_Name: locnName,
          Address_Line_1: addLine1,
          Suite_No: suiteNum,
          Address_Line_2: addLine2,
          City: city,
          State: state,
          Zip_Code: zipCode,
          Phone_Number: phoneNum,
          Time_Zone: timeZone,
          Facility_Times: facilityTime,
          Appointment_Pool: appPool
        };

        if (that.props.predefinedData && Object.entries(that.props.predefinedData).length !== 0) {
          loc['id'] = that.props.predefinedData.id;
        }
        else {
          loc['id'] = count + 1;
        }
        locationStore.put(loc);
      };

    };
    this.props.checkState("LocationDisplay");
  };
  componentDidMount() {
    this.initializeDataInputs();
    if (this.props.predefinedData && Object.entries(this.props.predefinedData).length !== 0) {
      let {
        Location_Name: locnName,
        Address_Line_1: addLine1,
        Suite_No: suiteNum,
        Address_Line_2: addLine2,
        City: city,
        State: state,
        Zip_Code: zipCode,
        Phone_Number: phoneNum,
        Time_Zone: timeZone,
        Appointment_Pool: appPool
      } = this.props.predefinedData;
      let dataObj = {};
      dataObj['locnName'] = locnName ? locnName :'';
      dataObj['addLine1'] = addLine1 ? addLine1 :'';
      dataObj['suiteNum'] = suiteNum ? suiteNum :'';
      dataObj['addLine2'] = addLine2 ? addLine2 :'';
      dataObj['city'] = city ? city :'';
      dataObj['state'] = state ? state :'';
      dataObj['zipCode'] = zipCode ? zipCode :'';
      dataObj['phoneNum'] = phoneNum ? phoneNum :'';
      dataObj['timeZone'] = timeZone ? timeZone :'';
      dataObj['appPool'] = appPool ? appPool :'';
      this.setState({ dataObj });
    }
  }
  componentDidUpdate(prevProps, prevState){
    if(prevState.showFacilityTimes && !this.state.showFacilityTimes)
    this.initializeDataInputs();
  }

  initializeDataInputs(){
    const handleLabels = (() => {
      const handleFocus = e => {
        const target = e.target;
        target.parentNode.classList.add("active");
        target.setAttribute(
          "placeholder",
          target.getAttribute("data-placeholder")
        );
      };
      const handleBlur = e => {
        const target = e.target;
        if (!target.value) {
          target.parentNode.classList.remove("active");
        }
        target.removeAttribute("placeholder");
      };
      const bindEvents = element => {
        const floatField = element.querySelector("input");
        if (floatField){
        floatField.addEventListener("focus", handleFocus);
        floatField.addEventListener("blur", handleBlur);}
      };
      const init = () => {
        const floatContainers = document.querySelectorAll(".float-container");
        floatContainers.forEach(element => {
          if ((element.querySelector("input") && element.querySelector("input").value) || ((this.props.predefinedData && Object.entries(this.props.predefinedData).length !== 0))) {
            element.classList.add("active");
          }
          bindEvents(element);
        });
      };
      return {
        init: init
      };
    })();

    handleLabels.init();
  }
  changeHandler(event) {
    let dataObj = this.state.dataObj ? this.state.dataObj : {};
    dataObj[event.target.id] = event.target.value;
    this.setState({ dataObj });
  }
  setFacilityTimes(data){
    let dataObj = this.state.dataObj;    
    if(data)
    dataObj['facilityTime']=data;
    this.setState({showFacilityTimes:!this.state.showFacilityTimes, dataObj})

  }
  selectedFacilityData(){
    if(this.state.dataObj['facilityTime'] && Object.entries(this.state.dataObj['facilityTime']).length>0){
    let str = '';
    Object.keys(this.state.dataObj['facilityTime']).map((el)=>{str+=el+':'+this.state.dataObj['facilityTime'][el][0]+' to '+this.state.dataObj['facilityTime'][el][1]+', '});
    return str.substring(0, str.length - 2);
  }
  }
  render() {
    if (this.state.showFacilityTimes)
    return <FacilityTimes setFacilityTimes={this.setFacilityTimes}/>

    return (
      <div className="bgw m50 bsh p10 fs14 txtGr">
        <div className="clDb fs16 fw7 mb10">Add Locations</div>
        <div className="clb fs14 fr ">
          <span id="floatContainer" className="float-container">
            <label for="locnName">Location Name</label>
            <input id="locnName" className="w95" type="text" data-placeholder="" onChange={(event) => this.changeHandler(event)} value={this.state.dataObj['locnName']} />
          </span>
        </div>
        <div className="df">
          <span id="floatContainer" className="float-container">
            <label for="addLine1">Address Line 1</label>
            <input id="addLine1" className="w90" type="text" data-placeholder="" onChange={(event) => this.changeHandler(event)} value={this.state.dataObj['addLine1']} />
          </span>
          <span id="floatContainer" className="float-container">
            <label for="suiteNum">Suite No.</label>
            <input id="suiteNum" className="w90" type="text" data-placeholder="" onChange={(event) => this.changeHandler(event)} value={this.state.dataObj['suiteNum']} />
          </span>
        </div>
        <div className="df">
          <span id="floatContainer" className="float-container">
            <label for="addLine2">Address Line 2</label>
            <input id="addLine2" type="text" className="w90" data-placeholder="" onChange={(event) => this.changeHandler(event)} value={this.state.dataObj['addLine2']} />
          </span>
          <span id="floatContainer" className="float-container">
            <label for="city">City</label>
            <input id="city" type="text" className="w90" data-placeholder="" onChange={(event) => this.changeHandler(event)} value={this.state.dataObj['city']} />
          </span>
          <span id="floatContainer" className="float-container active" style={{position:'relative'}}>
            <label for="state">State</label>
            <select id="state" style={{position:'absolute', marginTop:'32px', marginLeft:'-5px'}} className="drop" onChange={(event) => this.changeHandler(event)}>
                <option value="UP" selected={this.state.dataObj['state'] === 'UP'}>UP</option>
                <option value="MP" selected={this.state.dataObj['state'] === 'MP'}>MP</option>
                <option value="RJ" selected={this.state.dataObj['state'] === 'RJ'}>RJ</option>
                <option value="MH" selected={this.state.dataObj['state'] === 'MH'}>MH</option>
                <option value="HP" selected={this.state.dataObj['state'] === 'HP'}>HP</option>
                <option value="UK" selected={this.state.dataObj['state'] === 'UK'}>UK</option>
                <option value="AP" selected={this.state.dataObj['state'] === 'AP'}>AP</option>
                <option value="KT" selected={this.state.dataObj['state'] === 'KT'}>KT</option>
              </select>
          </span>
        </div>
        <div className="df">
          <span id="floatContainer" className="float-container">
            <label for="zipCode">Zip Code</label>
            <input id="zipCode" type="text" className="w90" data-placeholder="" onChange={(event) => this.changeHandler(event)} value={this.state.dataObj['zipCode']} />
          </span>
          <span id="floatContainer" className="float-container">
            <label for="phoneNum">Phone Number</label>
            <input id="phoneNum" type="text" className="w90" data-placeholder="" onChange={(event) => this.changeHandler(event)} value={this.state.dataObj['phoneNum']} />
          </span>
          <span id="floatContainer" className="float-container" style={{position:'relative'}}>
            <label for="timeZone">Time Zone</label>
            <select id="timeZone" style={{position:'absolute', marginTop:'32px', marginLeft:'-5px'}} className="drop" onChange={(event) => this.changeHandler(event)}>
                <option value="Chicago (GMT-5)" selected={this.state.dataObj['timeZone'] === 'Chicago (GMT-5)'}>Chicago (GMT-5)</option>
                <option value="Denver (GMT-6)" selected={this.state.dataObj['timeZone'] === 'Denver (GMT-6)'}>Denver (GMT-6)</option>
                <option value="Los Angeles (GMT-7)" selected={this.state.dataObj['timeZone'] === 'Los Angeles (GMT-7)'}>Los Angeles (GMT-7)</option>
                <option value="Anchorage (GMT-8)" selected={this.state.dataObj['timeZone'] === 'Anchorage (GMT-8)'}>Anchorage (GMT-8)</option>
                <option value="Honolulu (GMT-10)" selected={this.state.dataObj['timeZone'] === 'Honolulu (GMT-10)'}>Honolulu (GMT-10)</option>
              </select>
          </span>
        </div>
        <div className="df">
          <span id="floatContainer" className="float-container">
            <label for="facTime">Facility Times</label>
            <input id="facTime" className="w90" onClick={()=>this.setFacilityTimes()} type="text" data-placeholder="" value={this.selectedFacilityData()} />
          </span>
          <span id="floatContainer" className="float-container">
            <label for="appPool">Appointment Pool</label>
            <input id="appPool" type="text" className="w90" data-placeholder="" onChange={(event) => this.changeHandler(event)} value={this.state.dataObj['appPool']} />
          </span>
        </div>
        <div className="df fr">
          <div>
            <button className="cl btn" onClick={() => this.props.checkState("LocationDisplay")} > Cancel </button>
          </div>
          <div>
            <button className="sv btn" onClick={() => this.addLoc()}> Save </button>
          </div>
        </div>
      </div>
    );
  }
}
