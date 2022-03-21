import React from "react";
import cookie from "react-cookies";

function Dashboard() {
  return (
    <div>
      <div className="dash_board">
        <h1 className="title">Explore one-of-a-kind finds from independent makers !!!</h1>
        <div className="dashboard_items">
          <div className="dashboard_item">
            <img
              src="https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="home"
            ></img>"
            <p style={{ fontsize: "19px", marginLeft: "10%",fontweight: "300",fontstyle: "italic"}}>Home Decor</p>
          </div>
          <div className="dashboard_item">
            <img
              src="https://images.pexels.com/photos/827518/pexels-photo-827518.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt="home"
            ></img>
            <p style={{ marginLeft: "-10%" , fontsize: "19px", fontweight: "300",fontstyle: "italic"}}>
              Outdoor & Garden
            </p>
          </div>
          <div className="dashboard_item">
            <img
              src="https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
              alt="home"
            ></img>
            <p style={{ fontsize: "19px", marginLeft: "10%",fontweight: "300",fontstyle: "italic"}}>
              Kitchen & Dining
            </p>
          </div>
          <div className="dashboard_item">
            <img
              src="https://images.pexels.com/photos/994515/pexels-photo-994515.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt="home"
            ></img>
            <p style={{ marginLeft: "10%" , fontsize: "19px", fontweight: "300",fontstyle: "italic"}}>Necklaces</p>
          </div>
          <div className="dashboard_item">
            <img
              src="https://images.pexels.com/photos/1410226/pexels-photo-1410226.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
              alt="home"
            ></img>
            <p style={{ marginLeft: "-10%" , fontsize: "19px", fontweight: "300",fontstyle: "italic" }}>
              Wedding Decor
            </p>
          </div>
          <div className="dashboard_item">
            <img
              src="https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
              alt="home"
            ></img>
            <p style={{ marginLeft: "-15%", fontsize: "19px", marginLeft: "10%",fontweight: "300",fontstyle: "italic" }}>
              On Sale & Discount
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
