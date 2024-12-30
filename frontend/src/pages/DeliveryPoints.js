import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddDeliveryPoint from "../components/AddDeliveryPoint";
import UpdateDeliveryPoint from "../components/UpdateDeliveryPoint";

function DeliveryPoints() {
  const comparableOperations = [
    "не менее",
    "более",
    "не более",
    "менее",
    "равно",
  ];

  const [showDeliveryPointModal, setShowDeliveryPointModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateDeliveryPoint, setUpdateDeliveryPoint] = useState([]);
  const [deliveryPoints, setAllDeliveryPoints] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [status, setStatus] = useState("");
  const [deliveryPointTypes, setAllDeliveryPointTypes] = useState([]);
  const [queryObject, setQueryObject] = useState({
    operationPacksCapacity: comparableOperations[0],
    packsCapacity: "",
    pointType: "",
  });
  const [query, setQuery] = useState("");
  const [queryStatus, setQueryStatus] = useState("");

  useEffect(() => {
    fetchDeliveryPointsData();
    fetchDeliveryPointTypesData();
  }, [updatePage]);

  const fetchDeliveryPointsData = () => {
    setStatus("");
    fetch(process.env.REACT_APP_API_PATH + "/delivery_points" + query)
      .then((response) => {
        if (response.status == 404) {
          setStatus("Ничего не найдено!");
          return [];
        }

        return response.json();
      })
      .then((data) => {
        setAllDeliveryPoints(data);
      })
      .catch((err) => {
        console.log(err);
        setStatus("Сервер недоступен. Попробуйте позже");
        toast.error("Сервер недоступен", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const fetchDeliveryPointTypesData = () => {
    fetch(process.env.REACT_APP_API_PATH + "/delivery_points/types")
      .then((response) => {
        if (response.status == 404) {
          return [];
        }

        return response.json();
      })
      .then((data) => {
        setAllDeliveryPointTypes(data);
        if (data.length != 0) setStatus("");
      })
      .catch((err) => {
        console.log(err);
        setStatus("Сервер недоступен. Попробуйте позже");
        toast.error("Сервер недоступен", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const addDeliveryPointModalSetting = () => {
    setShowDeliveryPointModal(!showDeliveryPointModal);
  };

  const updateDeliveryPointModalSetting = (selectedProductData) => {
    setUpdateDeliveryPoint(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  // Delete item
  const deleteItem = (deliveryPoint) => {
    fetch(
      process.env.REACT_APP_API_PATH + "/delivery_points/" + deliveryPoint.id,
      {
        method: "DELETE",
      }
    )
      .then((result) => {
        if (result.status == 400) {
          toast.error("Произошла внутренняя ошибка", {
            position: toast.POSITION.TOP_RIGHT,
          });
          return;
        }
        if (result.status == 500) {
          toast.error("Сервер недоступен", {
            position: toast.POSITION.TOP_RIGHT,
          });
          return;
        }
        if (result.status != 200 && result.status != 204) {
          toast.error("Неизвестная ошибка на сервере", {
            position: toast.POSITION.TOP_RIGHT,
          });
          return;
        }

        setUpdatePage(!updatePage);
        toast.info(
          "Точка доставки по адресу " +
            deliveryPoint.address +
            " успешно удалена!",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      })
      .catch((err) => {
        console.log(err);
        toast.error("Сервер недоступен", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const generateQuery = () => {
    setQuery("");
    setQueryStatus("");

    const getOperationSuffix = (value) => {
      switch (value) {
        case comparableOperations[4]:
          return "eq";
        case comparableOperations[0]:
          return "greater_eq";
        case comparableOperations[1]:
          return "greater";
        case comparableOperations[3]:
          return "less";
        case comparableOperations[2]:
          return "less_eq";
      }
    };

    if (queryObject.packsCapacity == "") queryObject.packsCapacity = null;

    if (queryObject.pointType == "") queryObject.pointType = null;

    if (queryObject.packsCapacity == null && queryObject.pointType == null) {
      handlePageUpdate();
      return;
    }

    if (queryObject.packsCapacity != null) {
      queryObject.packsCapacity = Number(queryObject.packsCapacity);

      if (!Number.isInteger(queryObject.packsCapacity)) {
        setQueryStatus("Количество пачек должно быть целым числом");
        return;
      }

      if (queryObject.packsCapacity < 0) {
        setQueryStatus("Количество пачек должно быть больше 0");
        return;
      }
    }

    let query = "";

    if (queryObject.packsCapacity != null) {
      query +=
        "packs_capacity_" +
        getOperationSuffix(queryObject.operationPacksCapacity) +
        "=" +
        queryObject.packsCapacity;
    }

    if (queryObject.pointType != null) {
      if (query != "") query += "&";
      query += "point_type" + "=" + queryObject.pointType;
    }

    console.log(query);

    setQuery("?" + query);
    handlePageUpdate();
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showDeliveryPointModal && (
          <AddDeliveryPoint
            addDeliveryPointModalSetting={addDeliveryPointModalSetting}
            deliveryPointTypes={deliveryPointTypes}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && (
          <UpdateDeliveryPoint
            updateDeliveryPointData={updateDeliveryPoint}
            handlePageUpdate={handlePageUpdate}
            deliveryPointTypes={deliveryPointTypes}
            updateModalSetting={updateDeliveryPointModalSetting}
          />
        )}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Точки доставки</span>
              <div className="flex gap-4">
                <label
                  htmlFor="operationPacksCapacity"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Вместимость (пачки)
                </label>
                <select
                  id="operationPacksCapacity"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  name="operationPacksCapacity"
                  onChange={(e) =>
                    (queryObject.operationPacksCapacity = e.target.value)
                  }
                >
                  {comparableOperations.map((element, index) => {
                    return (
                      <option
                        key={element}
                        value={element}
                        selected={index == 0}
                      >
                        {element}
                      </option>
                    );
                  })}
                </select>
                <input
                  type="text"
                  name="packsCapacity"
                  id="packsCapacity"
                  value={queryObject.packsCapacity}
                  onChange={(e) => {
                    setQueryObject({
                      ...queryObject,
                      packsCapacity: e.target.value,
                    });
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                />
              </div>
              <div className="flex gap-4">
                <label
                  htmlFor="pointType"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Тип точки
                </label>
                <select
                  id="pointType"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  name="pointType"
                  onChange={(e) => {
                    setQueryObject({
                      ...queryObject,
                      pointType: e.target.value,
                    });
                  }}
                >
                  <option defaultValue=""></option>
                  {deliveryPointTypes.map((element, index) => {
                    return (
                      <option key={element} value={element}>
                        {element}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-3 text-xs  rounded"
                  onClick={generateQuery}
                >
                  Искать
                </button>
              </div>
              <div className="flex gap-4">
                <p style={{ color: "red" }}>{queryStatus}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addDeliveryPointModalSetting}
              >
                Добавить
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  ID
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Адрес
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Тип точки
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Вместимость (в пачках)
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {deliveryPoints.map((element, index) => {
                return (
                  <tr key={element.id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.address}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.pointType.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.packsCapacity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <span
                        className="text-green-700 cursor-pointer"
                        onClick={() => {
                          updateDeliveryPointModalSetting(element);
                        }}
                      >
                        Изменить{" "}
                      </span>
                      <span
                        className="text-red-600 px-2 cursor-pointer"
                        onClick={() => deleteItem(element)}
                      >
                        Удалить
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex gap-4 justify-center items-center">
            <p>{status}</p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default DeliveryPoints;
