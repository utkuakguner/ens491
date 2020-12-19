import React, { Component } from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";

import agents from "./agents.json";
import routers from "./routers.json";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
          center: [40.89175, 29.3781],
          agents: {},
          routers: []
        };

        this.convertCoordinate = this.convertCoordinate.bind(this);
        this.parseRouter = this.parseRouter.bind(this);
        this.getAgent = this.getAgent.bind(this);
        this.buildTrajectory = this.buildTrajectory.bind(this);
        this.updateTrajectory = this.updateTrajectory.bind(this);
        this.getAbsoluteCoordinate = this.getAbsoluteCoordinate.bind(this);
    }

    componentDidMount () {
      const { getAgent, buildTrajectory } = this;

      setTimeout(() => {
        buildTrajectory(getAgent("16732"));
        buildTrajectory(getAgent("44563"));
        buildTrajectory(getAgent("52875"));
        buildTrajectory(getAgent("38937"));
      }, 1000);
    }

    convertCoordinate (c) {  
      return c / 130000;
    }

    parseRouter (obj) {
      const tempArray = obj["BuildingID,BuildingX,BuildingY,DoorID,DoorX,DoorY"].split(","),
      name = tempArray[0],
      x = tempArray[4],
      y = tempArray[5],
      { center } = this.state,
      { convertCoordinate } = this;

      return [name, [center[0] + convertCoordinate(-y), center[1] + convertCoordinate(-x)]];
    }

    getAgent (id) {
      const result = [];

      agents.map((item) => {
        if (item["AgentID,AgentX,AgentY,TimeInSeconds"].split(",")[0] == id) {
          result.push(item["AgentID,AgentX,AgentY,TimeInSeconds"].split(","));
        }
      });
      
      return result;
    }

    buildTrajectory (agent) {
      const { agents } = this.state,
      { updateTrajectory } = this;
      
      const trajectoryStyle = {
        width: 25,
        height: 25,
        position: "absolute",
        zIndex: 1000,
        transition: "1s",
        border: "2px solid rgba(255,18,89, 1)",
        backgroundColor: "rgba(255,18,89, 0.5)",
        borderRadius: "50%"
      }

      const coordinates = this.getAbsoluteCoordinate(agent[0][1], agent[0][2]);

      trajectoryStyle.top = coordinates[1];
      trajectoryStyle.left = coordinates[0];

      agents[String(agent[0][0])] = <div style={trajectoryStyle} />; 
      let time = 0;

      this.setState({
        agents
      }, () => {
        updateTrajectory(1, agent);
      });
    }

    getAbsoluteCoordinate (x, y) {
      let index = -1;

      routers.map((item, i) => {
        const nItem = item["BuildingID,BuildingX,BuildingY,DoorID,DoorX,DoorY"].split(",");
        if (Math.abs(parseInt(nItem[4]) - x) < 20 && Math.abs(parseInt(nItem[5]) - y) < 20) {
          index = i;
        }
      });

      if (index == -1) {
        return [x, y];
      } { 
        const el = document.getElementsByClassName("leaflet-marker-icon")[index],
        nx = el.getBoundingClientRect().left,
        ny = el.getBoundingClientRect().top;

        return [nx, ny];
      }
    }

    updateTrajectory (c, agent) {
      const { agents } = this.state;
      if (c == agent.length) {
        return;
      }

      const trajectoryStyle = {
        width: 25,
        height: 25,
        position: "absolute",
        zIndex: 1000,
        transition: "1s",
        border: "2px solid rgba(255,18,89, 1)",
        backgroundColor: "rgba(255,18,89, 0.5)",
        borderRadius: "50%"
      }

      const coordinates = this.getAbsoluteCoordinate(agent[c][1], agent[c][2]);

      trajectoryStyle.top = coordinates[1];
      trajectoryStyle.left = coordinates[0];
      agents[agent[0][0]] = <div style={trajectoryStyle} />;
      this.setState({
        agents
      }, () => {
        setTimeout(() => {
          this.updateTrajectory(c + 1, agent);
        }, 1000 * (agent[c][3] / 10800));
      });
    }

    render() {
        const { center, agents } = this.state,
        { parseRouter } = this;
        return (
            <>
              <MapContainer style={{height: "100vh", overflow: "hidden"}} center={center} zoom={17} minZoom={17} maxZoom={18} scrollWheelZoom={false}>
                <TileLayer
                  attribution='ENS 491 PROJECT'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* <Marker position={center}>
                  <Popup>
                    Merkez noktası
                  </Popup>
                </Marker> */}
                {routers.map((item) => {
                  const res = parseRouter(item);
                  return (
                    <Marker position={res[1]}>
                      <Popup>
                        {res[0]}
                      </Popup>
                    </Marker>
                  );
                })}
                {Object.keys(agents).map((item) => (
                  <>
                    {agents[item]}
                  </>
                ))}
              </MapContainer>
            </>
        );
    }
}

export default App;
