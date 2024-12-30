package space.arlet.course4backend.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.enums.ParameterIn
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import lombok.extern.log4j.Log4j2
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import space.arlet.course4backend.controller.filters.DateFilter
import space.arlet.course4backend.controller.filters.RangeFilter
import space.arlet.course4backend.controller.responses.EntityCreatedResponse
import space.arlet.course4backend.core.Delivery
import space.arlet.course4backend.exceptions.BadEntityException
import space.arlet.course4backend.exceptions.EntityNotFoundException
import space.arlet.course4backend.repo.DeliveryPointRepo
import space.arlet.course4backend.repo.DeliveryRepo
import space.arlet.course4backend.repo.FactoryRepo
import space.arlet.course4backend.repo.TransportRepo
import java.time.LocalDateTime

@RestController
@Log4j2
class DeliveryController @Autowired constructor(
    private val deliveryRepo: DeliveryRepo,
    private val factoryRepo: FactoryRepo,
    private val transportRepo: TransportRepo,
    private val deliveryPointRepo: DeliveryPointRepo,
    private val dateFilter: DateFilter,
    private val rangeFilter: RangeFilter,
) {
    private val logger = LoggerFactory.getLogger("application")

    data class DeliveryCreatingEntity(
        val id: Int,
        val transportNumber: String?,
        val deliveryPointID: Int?,
        val packsCount: Int?,
        val factoryID: Int?,
        val departureDate: LocalDateTime?,
        val arrivalDate: LocalDateTime?,
    )

    @Operation(summary = "Get all deliveries")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully getting all deliveries",
                content = arrayOf(
                    Content(
                        mediaType = "application/json",
                        array = ArraySchema(schema = Schema(implementation = Delivery::class))
                    ),
                )
            ),
            ApiResponse(
                responseCode = "404", description = "No such delivery was found", content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "500", description = "Internal error", content = arrayOf(Content()),
            )
        ]
    )
    @GetMapping("\${api.path}/deliveries")
    @ResponseBody
    fun getDeliveries(
        @RequestParam(name = "transport_number", required = false) transportNumber: String?,
        @RequestParam(name = "delivery_point_id", required = false) deliveryPointID: Int?,
        @RequestParam(name = "delivery_point_type", required = false) deliveryPointType: String?,
        @RequestParam(name = "packs_count_greater", required = false) greaterPacksCount: Int?,
        @RequestParam(name = "packs_count_greater_eq", required = false) greaterEqPacksCount: Int?,
        @RequestParam(name = "packs_count_less", required = false) lessPacksCount: Int?,
        @RequestParam(name = "packs_count_less_eq", required = false) lessEqPacksCount: Int?,
        @RequestParam(name = "packs_count_eq", required = false) eqPacksCount: Int?,
        @RequestParam(name = "factory_id", required = false) factoryID: Int?,
        @RequestParam(name = "departure_date_before", required = false) departureDateBefore: LocalDateTime?,
        @RequestParam(name = "departure_date_after", required = false) departureDateAfter: LocalDateTime?,
        @RequestParam(name = "departure_date_on", required = false) departureDateOn: LocalDateTime?,
        @RequestParam(name = "arrival_date_before", required = false) arrivalDateBefore: LocalDateTime?,
        @RequestParam(name = "arrival_date_after", required = false) arrivalDateAfter: LocalDateTime?,
        @RequestParam(name = "arrival_date_on", required = false) arrivalDateOn: LocalDateTime?,
    ): List<Delivery> {
        logger.debug("start getting deliveries")

        val deliveries = deliveryRepo.findAll().toList().filter {
            if (!rangeFilter.equal(it.transport?.transportNumber, transportNumber))
                return@filter false

            if (!rangeFilter.equal(it.deliveryPoint?.id, deliveryPointID))
                return@filter false

            if (!rangeFilter.equal(it.deliveryPoint?.pointType?.name, deliveryPointType))
                return@filter false

            if (!rangeFilter.inRange(
                    it.packsCount,
                    greaterPacksCount,
                    greaterEqPacksCount,
                    lessPacksCount,
                    lessEqPacksCount,
                    eqPacksCount
                )
            )
                return@filter false

            if (!rangeFilter.equal(it.factory?.id, factoryID))
                return@filter false

            if (!dateFilter.isDateValid(it.departureDate, departureDateBefore, departureDateAfter, departureDateOn))
                return@filter false

            if (!dateFilter.isDateValid(it.arrivalDate, arrivalDateBefore, arrivalDateAfter, arrivalDateOn))
                return@filter false

            return@filter true
        }.sortedBy { it.id }

        if (deliveries.isEmpty()) {
            logger.debug("deliveries is empty")
            throw EntityNotFoundException("deliveries")
        }

        return deliveries
    }

    @Operation(summary = "Add delivery")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "201", description = "Successfully creating delivery", content = arrayOf(
                    Content(
                        mediaType = "application/json",
                        schema = Schema(implementation = EntityCreatedResponse::class)
                    )
                )
            ),
            ApiResponse(
                responseCode = "400",
                description = "In case if bad json body was provided",
                content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "500", description = "Internal error", content = arrayOf(Content()),
            )
        ]
    )
    @PostMapping("\${api.path}/deliveries")
    fun addDelivery(@RequestBody delivery: DeliveryCreatingEntity): ResponseEntity<EntityCreatedResponse<Int>> {
        logger.debug("start adding deliveries")

        try {
            val createdEntity = deliveryRepo.save(
                Delivery(
                    id = delivery.id,
                    transport = delivery.transportNumber?.let {
                        transportRepo.findById(it).orElseThrow { throw EntityNotFoundException("transport") }
                    },
                    deliveryPoint = delivery.deliveryPointID?.let {
                        deliveryPointRepo.findById(it).orElseThrow { throw EntityNotFoundException("delivery point") }
                    },
                    packsCount = delivery.packsCount,
                    factory = delivery.factoryID?.let {
                        factoryRepo.findById(it).orElseThrow {
                            throw EntityNotFoundException("factory")
                        }
                    },
                    departureDate = delivery.departureDate,
                    arrivalDate = delivery.arrivalDate,
                )
            )

            return ResponseEntity(EntityCreatedResponse(createdEntity.id), HttpStatus.CREATED)
        } catch (_: IllegalArgumentException) {
            throw BadEntityException("entity was empty")
        }
    }

    @Operation(summary = "Get delivery", parameters = [Parameter(name = "id", `in` = ParameterIn.PATH)])
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully get delivery", content = arrayOf(
                    Content(
                        mediaType = "application/json", schema = Schema(implementation = Delivery::class)
                    )
                )
            ),
            ApiResponse(
                responseCode = "400",
                description = "In case if path parameter is empty",
                content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "404",
                description = "In case if delivery is not found",
                content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "500", description = "Internal error", content = arrayOf(Content()),
            )
        ]
    )
    @GetMapping("\${api.path}/deliveries/{id}")
    @ResponseBody
    fun getDelivery(@PathVariable id: Int): Delivery {
        logger.debug("start getting delivery by ID")
        val delivery = deliveryRepo.findById(id)

        if (delivery.isEmpty) {
            throw EntityNotFoundException()
        }

        return delivery.get()
    }

    @Operation(summary = "Delete delivery", parameters = [Parameter(name = "id", `in` = ParameterIn.PATH)])
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully deleting delivery", content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "204", description = "If delivery was deleted before", content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "400",
                description = "In case if path parameter is empty",
                content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "500", description = "Internal error", content = arrayOf(Content()),
            )
        ]
    )
    @DeleteMapping("\${api.path}/deliveries/{id}")
    fun deleteDelivery(@PathVariable id: Int): ResponseEntity<String> {
        logger.debug("start deleting deliveries")

        if (deliveryRepo.existsById(id)) {
            deliveryRepo.deleteById(id)
            return ResponseEntity(HttpStatus.OK)
        }

        return ResponseEntity(HttpStatus.NO_CONTENT)
    }

    @Operation(summary = "Update delivery")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully updating delivery",
                content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "400",
                description = "In case if bad json body was provided",
                content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "500", description = "Internal error", content = arrayOf(Content()),
            )
        ]
    )
    @PutMapping("\${api.path}/deliveries")
    @ResponseBody
    fun updateTransport(
        @RequestBody delivery: DeliveryCreatingEntity
    ) {
        logger.debug("start updating transport")
        try {
            deliveryRepo.save(
                Delivery(
                    id = delivery.id,
                    transport = delivery.transportNumber?.let {
                        transportRepo.findById(it).orElseThrow { throw EntityNotFoundException("transport") }
                    },
                    deliveryPoint = delivery.deliveryPointID?.let {
                        deliveryPointRepo.findById(it).orElseThrow { throw EntityNotFoundException("delivery point") }
                    },
                    packsCount = delivery.packsCount,
                    factory = delivery.factoryID?.let {
                        factoryRepo.findById(it).orElseThrow {
                            throw EntityNotFoundException("factory")
                        }
                    },
                    departureDate = delivery.departureDate,
                    arrivalDate = delivery.arrivalDate,
                )
            )
        } catch (_: IllegalArgumentException) {
            throw BadEntityException("entity was empty")
        }
    }
}