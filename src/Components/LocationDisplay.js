import React from "react";
export class LocationDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dbInitialized: false,
      location: "",
      pages: 1,
      count: '',
      itemsPerPage: 3,
      currPage: 1,
      currPageStart: 1,
      currPageEnd: 1
    };
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.last = this.last.bind(this);
    this.first = this.first.bind(this);
    this.setitemsPerPage = this.setitemsPerPage.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.editEntry = this.editEntry.bind(this);
  }
  componentDidMount(){
	  //this.setitemsPerPage();
  }

  getLocation = () => {
    let that = this;
    window.indexedDB.open("LocationDB", 1).onsuccess = function (event) {
      var db = event.target.result;

      var transaction = db.transaction("locations", "readwrite");

      var locationStore = transaction.objectStore("locations");

      locationStore.count().onsuccess = function (event) {
		 that.setState({ count: event.target.result, currPageEnd: event.target.result > 3 ? 3 : event.target.result});
      };
      if(typeof locationStore.getAll != 'undefined'){
        locationStore.getAll().onsuccess = function (event) {
          that.setState({ location: event.target.result });
        };
      }
      else{
        alert('All functionalities required to run this app are not supported by current browser')
      }
    };
  };
  setitemsPerPage(event) {
    let count = this.state.count;
    this.setState({
      itemsPerPage: event.target.value,
      currPage: 1,
      currPageStart: 1,
      currPageEnd: count > event.target.value ? event.target.value : count
    });
  }
  prev() {
    let {currPage, currPageStart, itemsPerPage} = this.state;
    if (currPage > 1) {
      this.setState({
        currPage: currPage - 1,
        currPageStart: currPageStart - itemsPerPage,
        currPageEnd: currPageStart - 1
      });
    }
  }
  next() {
    let {currPage, currPageEnd, itemsPerPage, count} = this.state;
    if ( itemsPerPage * (currPage) < count ) {
      let temp = itemsPerPage * (currPage + 1);
      this.setState({
        currPage: currPage + 1,
        currPageStart: currPageEnd + 1,
        currPageEnd: count > temp ? temp : count
      });
    }
  }
  first() {
    let {itemsPerPage, count} = this.state;  
    this.setState({
      currPage: 1,
      currPageStart: 1,
      currPageEnd: count > itemsPerPage ? itemsPerPage : count
    });
  }
  last() {
    let {itemsPerPage, count, currPageEnd} = this.state;  
    if (currPageEnd < count) {
      this.setState({
        currPage: Math.ceil(count / itemsPerPage),
        currPageStart: count + 1 - (count % itemsPerPage),
        currPageEnd: count
      });
    }
  }
  editEntry(locn) {
    this.props.checkState('AddLocation', locn, 'toEditData');
  }
  deleteEntry(id) {
    let that = this;
    var request = window.indexedDB.open("LocationDB", 1);
    request.onsuccess = function (event) {
      var db = event.target.result;

      var transaction = db.transaction("locations", "readwrite");

      var locationStore = transaction.objectStore("locations");
      locationStore.delete(id).onsuccess = function (event) {
        let newLocations = that.state.location;
        let index;
        newLocations.map((el, i) => {
          if (el.id === id)
            index = i;
        })
        newLocations.splice(newLocations.indexOf(id), 1);
        if (newLocations.length)
          that.setState({ location: newLocations })
        else
          that.props.checkState('NoLocation');
      };
    };
  }
  penSvg() {
    return <svg className="pen" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 53.255 53.255" >
      <path style={{ fill: "#D75A4A" }} d="M39.598,2.343c3.124-3.124,8.19-3.124,11.314,0s3.124,8.19,0,11.314L39.598,2.343z" />
      <polygon style={{ fill: "#ED8A19" }} points="42.426,17.899 16.512,43.814 15.982,48.587 44.548,20.02 44.548,20.02 " />
      <polygon style={{ fill: "#ED8A19" }} points="10.325,42.93 15.098,42.4 41.012,16.485 36.77,12.243 10.855,38.157 " />
      <polygon style={{ fill: "#ED8A19" }} points="35.356,10.829 33.234,8.707 33.234,8.707 4.668,37.273 9.441,36.743 " />
      <polygon style={{ fill: "#C7CAC7" }} points="48.79,15.778 48.79,15.778 50.912,13.657 39.598,2.343 37.476,4.465 37.477,4.465 " />
      <polygon style={{ fill: "#C7CAC7" }}  points="36.062,5.879 36.062,5.879 34.648,7.293 34.648,7.293 45.962,18.606 45.962,18.606   47.376,17.192 47.376,17.192 " />
      <path style={{ fill: "#FBCE9D" }} d="M14.424,44.488l-5.122,0.569c-0.036,0.004-0.073,0.006-0.109,0.006c0,0-0.001,0-0.001,0H9.192H9.192  c-0.001,0-0.001,0-0.001,0c-0.036,0-0.073-0.002-0.109-0.006c-0.039-0.004-0.071-0.026-0.108-0.035  c-0.072-0.017-0.141-0.035-0.207-0.067c-0.05-0.024-0.093-0.053-0.138-0.084c-0.057-0.04-0.109-0.083-0.157-0.134  c-0.038-0.04-0.069-0.081-0.1-0.127c-0.038-0.057-0.069-0.116-0.095-0.181c-0.022-0.054-0.038-0.107-0.05-0.165  c-0.007-0.032-0.024-0.059-0.028-0.092c-0.004-0.038,0.01-0.073,0.01-0.11c0-0.038-0.014-0.072-0.01-0.11l0.569-5.122l-5.122,0.569  c-0.037,0.004-0.075,0.006-0.111,0.006c-0.079,0-0.152-0.024-0.227-0.042L0.442,51.399l2.106-2.106c0.391-0.391,1.023-0.391,1.414,0  s0.391,1.023,0,1.414l-2.106,2.106l12.03-2.864c-0.026-0.109-0.043-0.222-0.03-0.339L14.424,44.488z" />
      <path style={{ fill: "#38454F" }} d="M3.962,49.293c-0.391-0.391-1.023-0.391-1.414,0l-2.106,2.106L0,53.255l1.856-0.442l2.106-2.106  C4.352,50.316,4.352,49.684,3.962,49.293z" />
      <polygon style={{ fill: "#F2ECBF" }} points="48.79,15.778 37.477,4.465 37.476,4.465 36.062,5.879 36.062,5.879 47.376,17.192   47.376,17.192 48.79,15.778 " />
      <path style={{ fill: "#EBBA16" }} d="M41.012,16.485L15.098,42.4l-4.773,0.53l0.53-4.773L36.77,12.243l-1.414-1.414L9.441,36.743  l-4.773,0.53l-1.133,1.133l-0.228,0.957c0.075,0.018,0.147,0.042,0.227,0.042c0.036,0,0.074-0.002,0.111-0.006l5.122-0.569  l-0.569,5.122c-0.004,0.038,0.01,0.073,0.01,0.11c0,0.038-0.014,0.072-0.01,0.11c0.004,0.033,0.021,0.06,0.028,0.092  c0.012,0.057,0.029,0.112,0.05,0.165c0.026,0.064,0.057,0.124,0.095,0.181c0.03,0.045,0.063,0.088,0.1,0.127  c0.047,0.05,0.1,0.094,0.157,0.134c0.044,0.031,0.089,0.061,0.138,0.084c0.065,0.031,0.135,0.05,0.207,0.067  c0.038,0.009,0.069,0.03,0.108,0.035c0.036,0.004,0.072,0.006,0.109,0.006h0.001h0h0.001h0.001c0,0,0.001,0,0.001,0h0  c0.035,0,0.072-0.002,0.109-0.006l5.122-0.569l-0.569,5.122c-0.013,0.118,0.004,0.23,0.03,0.339l0.963-0.229l1.133-1.132l0.53-4.773  l25.914-25.915L41.012,16.485z" />
      <polygon style={{ fill: "#F2ECBF" }} points="45.962,18.606 34.648,7.293 34.648,7.293 33.234,8.707 33.234,8.707 35.356,10.829   36.77,12.243 41.012,16.485 42.426,17.899 44.548,20.02 44.548,20.02 45.962,18.606 " />
    </svg>
  }
  binSvg() {
    return <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 110 110" width="30" >
      <path d="m64.3025436 15h-18.6050834c-.9929047 0-1.79776.8048553-1.79776 1.7977581v7.9036846h3.790287v-6.2540951h14.6108818v6.2540951h3.799427v-7.9036846c0-.9929028-.8048553-1.7977581-1.7977524-1.7977581z" fill="#e56353" />
      <path d="m26.2549152 31.9276218 5.7795086 58.7816162c.2394982 2.4348355 2.2868843 4.290762 4.7332878 4.290762h36.4645729c2.4464035 0 4.4937973-1.8559265 4.7332916-4.2907639l5.7795105-58.7816162h-57.4901714z" fill="#e56353" />
      <g fill="#d15241">
        <path d="m43.1202087 88.9009781h-4.9270706l-3.3791008-47.3247986h5.9176827z" />
        <path d="m52.6824417 88.9009781h-4.9270706l-1.4565697-47.3247986h5.9176827z" />
        <path d="m62.2446747 88.9009781h-4.9270744l.4659614-47.3247986h5.9176827z" />
        <path d="m71.8069077 88.9009781h-4.9270707l2.3884888-47.3247986h5.9176788z" />
      </g>
      <path d="m86.2164917 27.2627449-5.1172028-2.7579441c-1.5614624-.8415394-3.3077698-1.2821941-5.0816269-1.2821941h-42.035324c-1.7738533 0-3.5201683.4406548-5.081625 1.2821941l-5.1172085 2.7579441c-.6603203.3558292-1.0720005 1.0454521-1.0720005 1.7956657v4.1007271c0 1.2029877.9751682 2.178154 2.178154 2.178154h60.2206879c1.2029877 0 2.178154-.9751663 2.178154-2.178154v-4.1007271c-.000002-.7502136-.4116841-1.4398365-1.0720082-1.7956657z" fill="#e56353" />
      <path d="m22.8195744 28.4333439c-.0648861.2001667-.1080704.4081554-.1080704.6250668v4.1007271c0 1.2029877.9751682 2.178154 2.178154 2.178154h60.2206879c1.2029877 0 2.178154-.9751663 2.178154-2.178154v-4.1007271c0-.2169113-.0431824-.4249001-.1080704-.6250668z" fill="#d15241" />
    </svg>
  }
  render() {
    let that = this;
    if (!this.state.location) {
      this.getLocation();
    }
    if (this.state.count === 0)
      this.props.checkState('NoLocation');
    
	let list;
    let { count, currPageEnd, itemsPerPage } = this.state;
    currPageEnd = currPageEnd ? currPageEnd : (count > itemsPerPage ? itemsPerPage : count)
    if (this.state.location) {
      let locArr = this.state.location.slice(this.state.currPageStart - 1, currPageEnd);
      list = locArr.map((locn, i) => {
        i++;
        return (
          <div className="df ja bsh crvd">
            <span className="blSp tmbl">
              {i + (this.state.currPage - 1) * this.state.itemsPerPage}
            </span>
            <span className="w20">{locn.Location_Name}</span>
            <span className="w20">{locn.Address_Line_1}</span>
            <span className="w20">{locn.Phone_Number}</span>
            <span>
              <span onClick={() => this.editEntry(locn)}>{this.penSvg()}</span>
              <span onClick={() => this.deleteEntry(locn.id)}>{this.binSvg()}</span>
            </span>
          </div>
        );
      });
    }
      return (
        <div className="df fdcl fs14">
          <div className="df ja bsh crvd fw7">
            <span />
            <span>Location Name</span>
            <span>Address</span>
            <span>Phone No.</span>
            <span />
          </div>
          {list}
          <div className="df jc bsh crvd txtGr">
            <span className="mlr10">Items per page:</span>
            <span>
              <select id="val" name="val" className="drop" onChange={this.setitemsPerPage}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
            </span>
            <span className="mlr10"> {that.state.currPageStart + " - " + currPageEnd + " of " + that.state.count} </span>
            <span className="mlr10 fw7" onClick={this.first}> {"| <"} </span>
            <span className="mlr10 fw7" onClick={this.prev}> {"<"} </span>
            <span className="mlr10 fw7" onClick={this.next}> {">"} </span>
            <span className="mlr10 fw7" onClick={this.last}> {"> |"} </span>
          </div>
        </div>
      );
  }
}
