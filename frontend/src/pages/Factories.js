import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddFactory from "../components/AddFactory";
import UpdateFactory from "../components/UpdateFactory";

function Factories() {
  const [showFactoryModal, setShowFactoryModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateFactory, setUpdateFactory] = useState([]);
  const [factories, setAllFactories] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchFactoriesData();
  }, [updatePage]);

  const fetchFactoriesData = () => {
    setStatus("");
    fetch(process.env.REACT_APP_API_PATH + "/factories")
      .then((response) => {
        if (response.status == 404) {
          setStatus("Ничего не найдено!");
          return [];
        }

        return response.json();
      })
      .then((data) => {
        setAllFactories(data);
      })
      .catch((err) => {
        console.log(err);
        setStatus("Сервер недоступен. Попробуйте позже");
        toast.error("Сервер недоступен", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  const addFactoryModalSetting = () => {
    setShowFactoryModal(!showFactoryModal);
  };

  const updateFactoryModalSetting = (selectedProductData) => {
    setUpdateFactory(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  // Delete item
  const deleteItem = (factory) => {
    fetch(process.env.REACT_APP_API_PATH + "/factories/" + factory.id, {
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
        toast.info(
          "Фабрика по адресу " + factory.address + " успешно удалена!",
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

  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        {showFactoryModal && (
          <AddFactory
            addFactoryModalSetting={addFactoryModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && (
          <UpdateFactory
            updateFactoryData={updateFactory}
            handlePageUpdate={handlePageUpdate}
            updateModalSetting={updateFactoryModalSetting}
          />
        )}

        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Фабрики</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addFactoryModalSetting}
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
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {factories.map((element, index) => {
                return (
                  <tr key={element.id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.address}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <span
                        className="text-green-700 cursor-pointer"
                        onClick={() => {
                          updateFactoryModalSetting(element);
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

export default Factories;
