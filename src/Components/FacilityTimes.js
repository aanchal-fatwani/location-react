import React from "react";
export class FacilityTimes extends React.Component {
  constructor(props) {
    super(props);
    this.checkHandler = this.checkHandler.bind(this);
    this.applyToAll = this.applyToAll.bind(this);
    this.state = {
      checkedDays: {
        Sun: [false, "10.30", "06.30"],
        Mon: [false, "10.30", "06.30"],
        Tue: [false, "10.30", "06.30"],
        Wed: [false, "10.30", "06.30"],
        Thu: [false, "10.30", "06.30"],
        Fri: [false, "10.30", "06.30"],
        Sat: [false, "10.30", "06.30"]
      }
    };
  }
  entries = () => {
    let list = [];
    let days = { 0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat" };
    for (let i = 0; i < 7; i++) {
      list.push(
        <div className="df fs14 lst">
          <div className="day">
            <input id={days[i]} checked={this.state.checkedDays[days[i][0]]} type="checkbox" onChange={this.checkHandler} />
            {days[i]}
          </div>
          <div>
            <input className="tm" type="text" placeholder="10.30" maxLength="5" />
            <span className="brd5l tmbl ampm">AM</span>
            <span className="brd5r tmgr ampm">PM</span>
          </div>
          <div className="">
            <input className="tm" type="text" placeholder="06.30" maxLength="5" />
            <span className="brd5l tmgr ampm">AM</span>
            <span className="brd5r tmbl ampm">PM</span>
          </div>
          <button name={days[i]} className="appAll btn" onClick={this.applyToAll} > Apply To All Checked </button>
        </div>
      );
    }
    return list;
  };
  applyToAll(event) {
    let day = event.target.parentNode.children[1];
    let start = day.children[0].value ? day.children[0].value : "10.30";
    let end = day.children[1].value ? day.children[1].value : "06.30";
    let updated = this.state.checkedDays;
    Object.keys(updated).map(el => {
      if (updated[el][0]) {
        updated[el][1] = start;
        updated[el][2] = end;
      }
      return null;
    });
    this.setState({ checkedDays: updated });
  }
  checkHandler(event) {
    let updated = this.state.checkedDays;
    updated[event.target.id][0] = !updated[event.target.id][0];
    this.setState({ checkedDays: updated });
  }
  addFacilityTime(){
    let checkedDays = this.state.checkedDays;
    Object.keys(checkedDays).map((el)=>{
      if(!checkedDays[el][0])
      delete checkedDays[el]
      else
      checkedDays[el] = checkedDays[el].slice(1)
      })
      this.props.setFacilityTimes(checkedDays);
  }
  render() {
    return (
      <div className="bgw m50 bsh p10 fs14 txtGr">
        <div className="clDb fs16 fw7 mb10">Facility Times</div>
        <div className="df ja fw7 ">
          <div>From</div>
          <div>To</div>
          <div/>
        </div>
        {this.entries()}
        <div className="df fr">
          <div>
            <button className="cl btn" onClick={() => this.props.checkState("AddLocation")} >
              Cancel
            </button>
          </div>
          <div>
            <button className="sv btn" onClick={() =>this.addFacilityTime()} > Save </button>
          </div>
        </div>
      </div>
    );
  }
}
