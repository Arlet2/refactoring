import React, { useState, useEffect } from "react";
import UpdateTransport from "../components/UpdateTransport";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddTransport from "../components/AddTransport";

function Transports() {
  const comparableOperations = [
    "не менее",
    "более",
    "не более",
    "менее",
    "равно",
  ];

  const [showTransportModal, setShowTransportModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateTransport, setUpdateTransport] = useState([]);
  const [transports, setAllTransports] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [queryStatus, setQueryStatus] = useState("");
  const [queryObject, setQueryObject] = useState({
    operationPacksCapacity: comparableOperations[0],
    packsCapacity: "",
    operationMaxWeight: comparableOperations[0],
    maxWeight: "",
  });

  useEffect(() => {
    fetchTransportsData();
  }, [updatePage]);

  const fetchTransportsData = () => {
    setStatus("");
    fetch(process.env.REACT_APP_API_PATH + "/transports" + query)
      .then((response) => {
        if (response.status == 404) {
          setStatus("Ничего не найдено!");
          return [];
        }

        return response.json();
      })
      .then((data) => {
        setAllTransports(data);
      })
      .catch((err) => {
        console.log(err);
        setStatus("Сервер недоступен. Попробуйте позже");
        toast.error("Сервер недоступен", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const addTransportModalSetting = () => {
    setShowTransportModal(!showTransportModal);
  };

  const updateTransportModalSetting = (selectedProductData) => {
    setUpdateTransport(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  const deleteItem = (id) => {
    fetch(process.env.REACT_APP_API_PATH + "/transports/" + id, {
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
        toast.info("Транспорт " + id + " успешно удалён!", {
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

    if (queryObject.maxWeight == "") queryObject.maxWeight = null;

    if (queryObject.packsCapacity == null && queryObject.maxWeight == null) {
      handlePageUpdate();
      return;
    }

    queryObject.packsCapacity = Number(queryObject.packsCapacity);
    queryObject.maxWeight = Number(queryObject.maxWeight);

    if (!Number.isInteger(queryObject.packsCapacity)) {
      setQueryStatus("Количество пачек должно быть целым числом");
      return;
    }

    if (queryObject.packsCapacity < 0) {
      setQueryStatus("Количество пачек должно быть больше 0");
      return;
    }

    if (!Number.isFinite(queryObject.maxWeight)) {
      setQueryStatus("Максимальный вес должен быть числом");
      return;
    }

    if (queryObject.maxWeight < 0) {
      setQueryStatus("Максимальный вес должен быть больше 0");
      return;
    }

    let query = "";

    if (queryObject.packsCapacity != null) {
      query +=
        "packs_capacity_" +
        getOperationSuffix(queryObject.operationPacksCapacity) +
        "=" +
        queryObject.packsCapacity;
    }

    if (queryObject.maxWeight != null) {
      if (query != "") query += "&";
      query +=
        "max_weight_" +
        getOperationSuffix(queryObject.operationMaxWeight) +
        "=" +
        queryObject.maxWeight;
    }

    setQuery("?" + query);
    handlePageUpdate();
  };

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showTransportModal && (
          <AddTransport
            addTransportModalSetting={addTransportModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && (
          <UpdateTransport
            updateTransportData={updateTransport}
            handlePageUpdate={handlePageUpdate}
            updateModalSetting={updateTransportModalSetting}
          />
        )}

        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Транспорт</span>
              <div className="flex gap-4">
                <label
                  htmlFor="packsCapacity"
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
                  htmlFor="maxWeight"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Максимальный вес (кг)
                </label>
                <select
                  id="operationMaxWeight"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  name="operationMaxWeight"
                  onChange={(e) =>
                    (queryObject.operationMaxWeight = e.target.value)
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
                  name="maxWeight"
                  id="maxWeight"
                  value={queryObject.maxWeight}
                  onChange={(e) => {
                    setQueryObject({
                      ...queryObject,
                      maxWeight: e.target.value,
                    });
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                />
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
                onClick={addTransportModalSetting}
              >
                Добавить
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Номер авто
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Вместимость (пачки)
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Максимальный вес (кг)
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {transports.map((element, index) => {
                return (
                  <tr key={element.transportNumber}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.transportNumber}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.packsCapacity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.maxWeight}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <span
                        className="text-green-700 cursor-pointer"
                        onClick={() => {
                          updateTransportModalSetting(element);
                        }}
                      >
                        Изменить{" "}
                      </span>
                      <span
                        className="text-red-600 px-2 cursor-pointer"
                        onClick={() => deleteItem(element.transportNumber)}
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

export default Transports;
