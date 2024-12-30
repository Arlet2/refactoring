import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export default function AddDelivery({
  addDeliveryModalSetting,
  transports,
  deliveryPoints,
  factories,
  handlePageUpdate,
}) {
  const [delivery, setDelivery] = useState({
    transportNumber: null,
    deliveryPointID: null,
    packsCount: null,
    factoryID: null,
    departureDate: null,
    arrivalDate: null,
  });
  const [open, setOpen] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setDelivery({ ...delivery, [key]: value });
  };

  const addDelivery = () => {
    setErrorMsg("");

    if (delivery.transportNumber == "") delivery.transportNumber = null;
    if (delivery.deliveryPointID == "") delivery.deliveryPointID = null;
    if (delivery.packsCount == "") delivery.packsCount = null;
    if (delivery.factoryID == "") delivery.factoryID = null;
    if (delivery.departureDate == "") delivery.departureDate = null;
    if (delivery.arrivalDate == "") delivery.arrivalDate = null;

    if (delivery.deliveryPointID != null)
      delivery.deliveryPointID = Number(delivery.deliveryPointID);
    if (delivery.packsCount != null) {
      delivery.packsCount = Number(delivery.packsCount);

      if (!Number.isInteger(delivery.packsCount)) {
        setErrorMsg("Количество пачек должно быть целым числом!");
        return;
      }

      if (delivery.packsCount < 0) {
        setErrorMsg("Количество пачек не может быть отрицательным");
        return;
      }
    }
    if (delivery.factoryID != null)
      delivery.factoryID = Number(delivery.factoryID);

    console.log(delivery);

    fetch(process.env.REACT_APP_API_PATH + "/deliveries", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(delivery),
    })
      .then((result) => {
        if (result.status == 208) {
          setErrorMsg("Данная доставка уже существует");
          return undefined;
        }
        if (result.status == 400) {
          setErrorMsg("Произошла внутренняя ошибка");
          return undefined;
        }
        if (result.status == 500) {
          setErrorMsg("Сервер недоступен");
          return undefined;
        }
        if (result.status != 201) {
          setErrorMsg("Неизвестная ошибка на сервере");
          return;
        }

        return result.json();
      })
      .then((result) => {
        if (result == undefined) {
          return;
        }
        console.log(result);
        handlePageUpdate();
        addDeliveryModalSetting();
        toast.success("Доставка " + result.id + " успешно создана!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg("Сервер недоступен");
      });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <PlusIcon
                        className="h-6 w-6 text-blue-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left ">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900 "
                      >
                        Добавить доставку
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="transportNumber"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Транспорт
                            </label>
                            <select
                              id="transportNumber"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="transportNumber"
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            >
                              <option defaultValue=""></option>
                              {transports.map((element, index) => {
                                return (
                                  <option
                                    key={element.transportNumber}
                                    value={element.transportNumber}
                                  >
                                    {element.transportNumber} (Максимум по весу:{" "}
                                    {element.maxWeight} кг; Вместимость:{" "}
                                    {element.packsCapacity} пачки)
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="deliveryPointID"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Точка доставки
                            </label>
                            <select
                              id="deliveryPointID"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="deliveryPointID"
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            >
                              <option defaultValue=""></option>
                              {deliveryPoints.map((element, index) => {
                                return (
                                  <option key={element.id} value={element.id}>
                                    {element.pointType.name} по адресу{" "}
                                    {element.address} (ID: {element.id})
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="packsCount"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Количество пачек
                            </label>
                            <input
                              type="text"
                              name="packsCount"
                              id="packsCount"
                              value={delivery.packsCount}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="factoryID"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Фабрика производства
                            </label>
                            <select
                              id="factoryID"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              name="factoryID"
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            >
                              <option defaultValue=""></option>
                              {factories.map((element, index) => {
                                return (
                                  <option key={element.id} value={element.id}>
                                    {element.address} (ID: {element.id})
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="h-fit w-fit">
                            <label
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              htmlFor="departureDate"
                            >
                              Время отправления
                            </label>
                            <input
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              type="datetime-local"
                              id="departureDate"
                              name="departureDate"
                              value={delivery.departureDate}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            />
                          </div>
                          <div className="h-fit w-fit">
                            <label
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              htmlFor="arrivalDate"
                            >
                              Время прибытия
                            </label>
                            <input
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              type="datetime-local"
                              id="arrivalDate"
                              name="arrivalDate"
                              value={delivery.arrivalDate}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </form>
                      <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        <p className="text-red-600">{errorMsg}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={addDelivery}
                  >
                    Добавить доставку
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => addDeliveryModalSetting()}
                    ref={cancelButtonRef}
                  >
                    Отмена
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
