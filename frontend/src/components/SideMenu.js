import React from "react";
import { Link } from "react-router-dom";

function SideMenu() {
  return (
    <div className="h-full flex-col justify-between  bg-white hidden lg:flex ">
      <div className="px-4 py-6">
        <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg hover:bg-gray-100 px-4 py-2 text-gray-700"
          >
            <img
              alt="dashboard-icon"
              src={require("../assets/dashboard-icon.png")}
            />
            <span className="text-sm font-medium"> Главная </span>
          </Link>

          <Link
            to="/deliveries"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <img
              alt="purchase-icon"
              src={require("../assets/inventory-icon.png")}
            />
            <span className="text-sm font-medium"> Доставки</span>
          </Link>

          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
              <Link to="/transports">
                <div className="flex items-center gap-2">
                  <img
                    alt="transport-icon"
                    src={require("../assets/transport-icon.png")}
                    style={{ width: "1.25em" }}
                  />
                  <span className="text-sm font-medium"> Транспорт </span>
                </div>
              </Link>
            </summary>
          </details>

          <Link
            to="/factories"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <img
              alt="factory-icon"
              src={require("../assets/factory-icon.png")}
              style={{ width: "1.5em" }}
            />
            <span className="text-sm font-medium"> Фабрики</span>
          </Link>
          <Link
            to="/delivery_points"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <img
              alt="delivery-point-icon"
              src={require("../assets/order-icon.png")}
            />
            <span className="text-sm font-medium"> Точки доставки</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default SideMenu;
