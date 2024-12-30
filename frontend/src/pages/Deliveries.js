import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddDelivery from "../components/AddDelivery";
import UpdateDelivery from "../components/UpdateDelivery";

function Deliveries() {
  const comparableOperations = [
    "не менее",
    "более",
    "не более",
    "менее",
    "равно",
  ];
  const dateOperations = ["до", "после", "равно"];

  const [showDeliveryModal, setDeliveryModal] = useState(false);
  const [updatePage, setUpdatePage] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateDelivery, setUpdateDelivery] = useState([]);
  const [transports, setAllTransports] = useState([]);
  const [deliveries, setAllDeliveries] = useState([]);
  const [factories, setAllFactories] = useState([]);
  const [deliveryPointTypes, setAllDeliveryPointTypes] = useState([]);
  const [deliveryPoints, setAllDeliveryPoints] = useState([]);
  const [queryStatus, setQueryStatus] = useState("");
  const [query, setQuery] = useState("");
  const [queryObject, setQueryObject] = useState({
    transportNumber: "",
    deliveryPointID: "",
    deliveryPointType: "",
    operationPacksCount: comparableOperations[0],
    packsCount: "",
    factoryID: "",
    operationDepartureDate: dateOperations[0],
    departureDate: "",
    operationArrivalDate: dateOperations[0],
    arrivalDate: "",
  });
  const [packsCountSum, setPacksCountSum] = useState(0);

  useEffect(() => {
    fetchFactoriesData();
    fetchTransportsData();
    fetchDeliveryPointsData();
    fetchDeliveriesData();
    fetchDeliveryPointTypesData();
  }, [updatePage]);

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
      })
      .catch((err) => {
        console.log(err);
        toast.error("Сервер недоступен", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const fetchTransportsData = () => {
    fetch(process.env.REACT_APP_API_PATH + "/transports")
      .then((response) => {
        if (response.status == 404) {
          return [];
        }

        return response.json();
      })
      .then((data) => {
        setAllTransports(data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Сервер недоступен", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const fetchFactoriesData = () => {
    fetch(process.env.REACT_APP_API_PATH + "/factories")
      .then((response) => {
        if (response.status == 404) {
          return [];
        }

        return response.json();
      })
      .then((data) => {
        setAllFactories(data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Сервер недоступен", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const fetchDeliveryPointsData = () => {
    fetch(process.env.REACT_APP_API_PATH + "/delivery_points")
      .then((response) => {
        if (response.status == 404) {
          return [];
        }

        return response.json();
      })
      .then((data) => {
        setAllDeliveryPoints(data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Сервер недоступен", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const fetchDeliveriesData = () => {
    fetch(process.env.REACT_APP_API_PATH + "/deliveries" + query)
      .then((response) => {
        if (response.status == 404) {
          return [];
        }

        return response.json();
      })
      .then((data) => {
        setAllDeliveries(data);
        let sum = 0;
        data.forEach((elem) => {
          sum += elem.packsCount;
        });

        setPacksCountSum(sum);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Сервер недоступен", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const deleteItem = (id) => {
    fetch(process.env.REACT_APP_API_PATH + "/deliveries/" + id, {
      method: "DELETE",
    })
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
        toast.info("Доставка " + id + " успешно удалена!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Сервер недоступен", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const addDeliveryModalSetting = () => {
    setDeliveryModal(!showDeliveryModal);
  };

  const updateDeliveryModalSetting = (selectedProductData) => {
    setUpdateDelivery(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const generateQuery = () => {
    setQuery("");
    setQueryStatus("");

    console.log(queryObject);

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

    const getDateOperationSuffix = (value) => {
      switch (value) {
        case dateOperations[0]:
          return "before";
        case dateOperations[1]:
          return "after";
        case dateOperations[2]:
          return "on";
      }
    };

    if (queryObject.transportNumber == "") queryObject.transportNumber = null;

    if (queryObject.deliveryPointID == "") queryObject.deliveryPointID = null;

    if (queryObject.deliveryPointType == "")
      queryObject.deliveryPointType = null;

    if (queryObject.packsCount == "") queryObject.packsCount = null;

    if (queryObject.factoryID == "") queryObject.factoryID = null;

    if (queryObject.departureDate == "") queryObject.departureDate = null;

    if (queryObject.arrivalDate == "") queryObject.arrivalDate = null;

    if (
      queryObject.transportNumber == null &&
      queryObject.deliveryPointID == null &&
      queryObject.deliveryPointType == null &&
      queryObject.packsCount == null &&
      queryObject.factoryID == null &&
      queryObject.departureDate == null &&
      queryObject.arrivalDate == null
    ) {
      handlePageUpdate();
      return;
    }

    console.log(queryObject);

    if (queryObject.packsCount != null) {
      queryObject.packsCount = Number(queryObject.packsCount);
      if (!Number.isInteger(queryObject.packsCount)) {
        setQueryStatus("Количество пачек должно быть целым числом");
        return;
      }

      if (queryObject.packsCount < 0) {
        setQueryStatus("Количество пачек должно быть больше 0");
        return;
      }
    }

    let query = "";

    if (queryObject.transportNumber != null) {
      query += "transport_number=" + queryObject.transportNumber;
    }

    if (queryObject.deliveryPointID != null) {
      if (query != "") query += "&";
      query += "delivery_point_id=" + queryObject.deliveryPointID;
    }

    if (queryObject.deliveryPointType != null) {
      if (query != "") query += "&";
      query += "delivery_point_type=" + queryObject.deliveryPointType;
    }

    if (queryObject.packsCount != null) {
      if (query != "") query += "&";
      query +=
        "packs_count_" +
        getOperationSuffix(queryObject.operationPacksCount) +
        "=" +
        queryObject.packsCount;
    }

    if (queryObject.factoryID != null) {
      if (query != "") query += "&";
      query += "factory_id=" + queryObject.factoryID;
    }

    if (queryObject.departureDate != null) {
      if (query != "") query += "&";
      query +=
        "departure_date_" +
        getDateOperationSuffix(queryObject.operationDepartureDate) +
        "=" +
        queryObject.departureDate;
    }

    if (queryObject.arrivalDate != null) {
      if (query != "") query += "&";
      query +=
        "arrival_date_" +
        getDateOperationSuffix(queryObject.operationArrivalDate) +
        "=" +
        queryObject.arrivalDate;
    }

    console.log(query);

    setQuery("?" + query);
    handlePageUpdate();
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showDeliveryModal && (
          <AddDelivery
            addDeliveryModalSetting={addDeliveryModalSetting}
            transports={transports}
            deliveryPoints={deliveryPoints}
            factories={factories}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && (
          <UpdateDelivery
            updateDeliveryData={updateDelivery}
            handlePageUpdate={handlePageUpdate}
            transports={transports}
            deliveryPoints={deliveryPoints}
            factories={factories}
            updateModalSetting={updateDeliveryModalSetting}
          />
        )}
        <div className="bg-white rounded p-3">
          <span className="font-semibold px-4">Общая статистика</span>
          <div className=" flex flex-col md:flex-row justify-center items-center  ">
            <div className="flex flex-col gap-3 p-10  w-full  md:w-3/12  border-y-2  md:border-x-2 md:border-y-0">
              <span className="font-semibold text-red-600 text-base">
                Всего доставок
              </span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    {deliveries.length}
                  </span>
                </div>
              </div>
              <span className="font-semibold text-black-600 text-base">
                Всего пачек
              </span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    {packsCountSum}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-10   w-full  md:w-3/12 sm:border-y-2  md:border-x-2 md:border-y-0">
              <span className="font-semibold text-blue-600 text-base">
                Всего транспортов
              </span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    {transports.length}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-10   w-full  md:w-3/12 sm:border-y-2  md:border-x-2 md:border-y-0">
              <span className="font-semibold text-yellow-600 text-base">
                Всего фабрик
              </span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    {factories.length}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-10  w-full  md:w-3/12  sm:border-y-2 md:border-x-2 md:border-y-0">
              <span className="font-semibold text-purple-600 text-base">
                Всего точек доставок
              </span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-base">
                    {deliveryPoints.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Доставки</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addDeliveryModalSetting}
              >
                Добавить
              </button>
            </div>
          </div>
          <div className="flex gap-4 justify-center items-center ">
            <div className="flex gap-4">
              <label
                htmlFor="transport"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Транспорт
              </label>
              <select
                id="transport"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="transport"
                onChange={(e) => {
                  setQueryObject({
                    ...queryObject,
                    transportNumber: e.target.value,
                  });
                }}
              >
                <option defaultValue=""></option>
                {transports.map((element, index) => {
                  return (
                    <option
                      key={"transport-" + element.transportNumber}
                      value={element.transportNumber}
                    >
                      {element.transportNumber} (вместимость:{" "}
                      {element.packsCapacity} пачки; максимальный вес:{" "}
                      {element.maxWeight} кг)
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex gap-4">
              <label
                htmlFor="deliveryPoint"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Точка доставки
              </label>
              <select
                id="deliveryPoint"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="deliveryPoint"
                onChange={(e) => {
                  setQueryObject({
                    ...queryObject,
                    deliveryPointID: e.target.value,
                  });
                }}
              >
                <option defaultValue=""></option>
                {deliveryPoints.map((element, index) => {
                  return (
                    <option
                      key={"deliveryPoint-" + element.id}
                      value={element.id}
                    >
                      {element.pointType.name} по адресу {element.address}{" "}
                      (вместимость: {element.packsCapacity} пачек; ID:{" "}
                      {element.id})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="flex gap-4 justify-center items-center m-5">
            <div className="flex gap-4">
              <label
                htmlFor="operationPacksCount"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Количество пачек
              </label>
              <select
                id="operationPacksCount"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="operationPacksCount"
                onChange={(e) => {
                  setQueryObject({
                    ...queryObject,
                    operationPacksCount: e.target.value,
                  });
                }}
              >
                {comparableOperations.map((element, index) => {
                  return (
                    <option key={element} value={element} selected={index == 0}>
                      {element}
                    </option>
                  );
                })}
              </select>
              <input
                type="text"
                name="packsCount"
                id="packsCount"
                value={queryObject.packsCount}
                onChange={(e) => {
                  setQueryObject({
                    ...queryObject,
                    packsCount: e.target.value,
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
                    deliveryPointType: e.target.value,
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
              <label
                htmlFor="factory"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Фабрика
              </label>
              <select
                id="factory"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="factory"
                onChange={(e) => {
                  setQueryObject({ ...queryObject, factoryID: e.target.value });
                }}
              >
                <option defaultValue=""></option>
                {factories.map((element, index) => {
                  return (
                    <option key={"factory-" + element.id} value={element.id}>
                      {element.address} (ID: {element.id})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="flex gap-4 justify-center items-center m-5 ">
            <div className="flex gap-4">
              <label
                htmlFor="departureDate"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Дата отправления
              </label>
              <select
                id="operationDepartureDate"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="operationDepartureDate"
                onChange={(e) => {
                  setQueryObject({
                    ...queryObject,
                    operationDepartureDate: e.target.value,
                  });
                }}
              >
                {dateOperations.map((element, index) => {
                  return (
                    <option key={"date-operation-" + element} value={element}>
                      {element}
                    </option>
                  );
                })}
              </select>
              <input
                type="datetime-local"
                name="departureDate"
                id="departureDate"
                value={queryObject.departureDate}
                onChange={(e) => {
                  setQueryObject({
                    ...queryObject,
                    departureDate: e.target.value,
                  });
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>
            <div className="flex gap-4">
              <label
                htmlFor="arrivalDate"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Дата прибытия
              </label>
              <select
                id="arrivalDate"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                name="arrivalDate"
                onChange={(e) => {
                  setQueryObject({
                    ...queryObject,
                    operationArrivalDate: e.target.value,
                  });
                }}
              >
                {dateOperations.map((element, index) => {
                  return (
                    <option key={"date-operation-" + element} value={element}>
                      {element}
                    </option>
                  );
                })}
              </select>
              <input
                type="datetime-local"
                name="arrivalDate"
                id="arrivalDate"
                value={queryObject.arrivalDate}
                onChange={(e) => {
                  setQueryObject({
                    ...queryObject,
                    arrivalDate: e.target.value,
                  });
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>
            <div className="flex gap-4">
              <p style={{ color: "red" }}>{queryStatus}</p>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-3 text-xs  rounded"
                onClick={generateQuery}
              >
                Искать
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
                  Номер транспорта
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Адрес конечного пункта
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Количество пачек
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Адрес фабрики
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Дата отправления
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Дата прибытия
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {deliveries.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.transport?.transportNumber ?? "НЕИЗВЕСТЕН"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.deliveryPoint?.address ?? "НЕИЗВЕСТЕН"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.packsCount ?? "НЕИЗВЕСТНО"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.factory?.address ?? "НЕИЗВЕСТЕН"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.departureDate == null
                        ? "НЕИЗВЕСТНА"
                        : new Date(element.departureDate).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.arrivalDate == null
                        ? "НЕИЗВЕСТНА"
                        : new Date(element.arrivalDate).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <span
                        className="text-green-700 cursor-pointer"
                        onClick={() => {
                          updateDeliveryModalSetting(element);
                        }}
                      >
                        Изменить{" "}
                      </span>
                      <span
                        className="text-red-600 px-2 cursor-pointer"
                        onClick={() => deleteItem(element.id)}
                      >
                        Удалить
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Deliveries;
