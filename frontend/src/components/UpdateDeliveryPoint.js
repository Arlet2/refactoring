import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export default function UpdateDeliveryPoint({
  updateDeliveryPointData,
  handlePageUpdate,
  deliveryPointTypes,
  updateModalSetting,
}) {
  const { id, address, pointType, packsCapacity } = updateDeliveryPointData;
  const [deliveryPoint, setDeliveryPoint] = useState({
    id: id,
    address: address,
    pointType: pointType.name,
    packsCapacity: packsCapacity,
  });
  const [open, setOpen] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const cancelButtonRef = useRef(null);

  const handleInputChange = (key, value) => {
    setDeliveryPoint({ ...deliveryPoint, [key]: value });
  };

  const updateFactory = () => {
    setErrorMsg("");
    deliveryPoint.packsCapacity = Number(deliveryPoint.packsCapacity);
    if (!Number.isInteger(deliveryPoint.packsCapacity)) {
      setErrorMsg("Количество пачек должно быть целым числом");
      return;
    }

    if (deliveryPoint.packsCapacity < 0) {
      setErrorMsg("Количество пачек не должно быть отрицательным числом");
      return;
    }

    if (deliveryPoint.address == "") {
      setErrorMsg("Адрес не должен быть пустым");
      return;
    }

    if (deliveryPoint.pointType == "") {
      setErrorMsg("Вы должны выбрать тип точки");
      return;
    }
    fetch(process.env.REACT_APP_API_PATH + "/delivery_points", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: deliveryPoint.id,
        address: deliveryPoint.address,
        packsCapacity: deliveryPoint.packsCapacity,
        pointType: {
          name: deliveryPoint.pointType,
        },
      }),
    })
      .then((result) => {
        if (result.status == 400) {
          setErrorMsg("Произошла внутренняя ошибка");
          result.json().then((result) => {
            console.log(result);
          });
          return;
        }
        if (result.status == 500) {
          setErrorMsg("Сервер недоступен");
          return;
        }
        if (result.status != 200) {
          setErrorMsg("Неизвестная ошибка на сервере");
          return;
        }
        setOpen(false);
        handlePageUpdate();
        updateModalSetting();
        toast.info(
          "Точка доставки по адресу " +
            deliveryPoint.address +
            " успешно обновлена!",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
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
                        Обновить точку доставки
                      </Dialog.Title>
                      <form action="#">
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="id"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              ID
                            </label>
                            <input
                              disabled
                              type="text"
                              name="id"
                              id="id"
                              value={deliveryPoint.id}
                              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="1"
                            />
                          </div>
                          <div className="grid gap-4 mb-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                              <label
                                htmlFor="address"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Адрес
                              </label>
                              <textarea
                                id="address"
                                rows="5"
                                name="address"
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Напишите адрес"
                                value={deliveryPoint.address}
                                onChange={(e) =>
                                  handleInputChange(
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div>
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
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                            >
                              <option></option>
                              {deliveryPointTypes.map((element, index) => {
                                return (
                                  <option
                                    key={element}
                                    value={element}
                                    selected={
                                      element == deliveryPoint.pointType
                                    }
                                  >
                                    {element}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="packsCapacity"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Вместимость (пачки)
                            </label>
                            <input
                              type="text"
                              name="packsCapacity"
                              id="packsCapacity"
                              value={deliveryPoint.packsCapacity}
                              onChange={(e) =>
                                handleInputChange(e.target.name, e.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="0"
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
                    onClick={updateFactory}
                  >
                    Обновить точку доставки
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => updateModalSetting()}
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
