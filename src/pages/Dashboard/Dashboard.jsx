import "./dashboard.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";

const Dashboard = () => {

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="home">
        <div className="homeContainer">
          <div className="widgets">
            <Widget type="Products" />
            <Widget type="SessionsExp" />
            <Widget type="SessionsImp" />
            <Widget type="products_runout" />
          </div>
          <div className="charts">
            <Featured />
            <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
          </div>
          <div className="listContainer">
            <div className="listTitle">Danh sách sản phẩm vừa nhập</div>
            <Table type={"SessionsImp"} />
          </div>
          <div className="listContainer">
            <div className="listTitle">Danh sách sản phẩm vừa xuất</div>
            <Table type={"SessionsExp"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
