package space.arlet.course4backend.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.enums.ParameterIn
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import space.arlet.course4backend.controller.filters.RangeFilter
import space.arlet.course4backend.controller.responses.EntityCreatedResponse
import space.arlet.course4backend.core.DeliveryPoint
import space.arlet.course4backend.exceptions.BadEntityException
import space.arlet.course4backend.exceptions.EntityNotFoundException
import space.arlet.course4backend.repo.DeliveryPointRepo
import space.arlet.course4backend.repo.DeliveryPointTypeRepo

@RestController
class DeliveryPointController @Autowired constructor(
    val deliveryPointRepo: DeliveryPointRepo,
    val rangeFilter: RangeFilter,
    val deliveryPointTypeRepo: DeliveryPointTypeRepo,
) {
    @Operation(summary = "Get all delivery points")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully getting all delivery points",
                content = arrayOf(
                    Content(
                        mediaType = "application/json",
                        array = ArraySchema(schema = Schema(implementation = DeliveryPoint::class))
                    ),
                )
            ),
            ApiResponse(
                responseCode = "404", description = "No such delivery point was found", content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "500", description = "Internal error", content = arrayOf(Content()),
            )
        ]
    )
    @GetMapping("\${api.path}/delivery_points")
    @ResponseBody
    fun getDeliveryPoints(
        @RequestParam(name = "packs_capacity_greater", required = false) greaterPacksCapacity: Int?,
        @RequestParam(name = "packs_capacity_greater_eq", required = false) greaterEqPacksCapacity: Int?,
        @RequestParam(name = "packs_capacity_less", required = false) lessPacksCapacity: Int?,
        @RequestParam(name = "packs_capacity_less_eq", required = false) lessEqPacksCapacity: Int?,
        @RequestParam(name = "packs_capacity_eq", required = false) eqPacksCapacity: Int?,
        @RequestParam(name = "point_type", required = false) pointType: String?,
    ): List<DeliveryPoint> {
        val deliveryPoints = deliveryPointRepo.findAll().toList().filter {
            if (!rangeFilter.inRange(
                    it.packsCapacity,
                    greaterPacksCapacity,
                    greaterEqPacksCapacity,
                    lessPacksCapacity,
                    lessEqPacksCapacity,
                    eqPacksCapacity,
                )
            )
                return@filter false
            if (!rangeFilter.equal(
                    it.pointType?.name,
                    pointType,
                )
            )
                return@filter false
            return@filter true

        }.sortedBy { it.id }

        if (deliveryPoints.isEmpty()) {
            throw EntityNotFoundException("delivery points")
        }

        return deliveryPoints
    }

    @Operation(summary = "Add delivery point")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "201",
                description = "Successfully creating delivery point",
                content = arrayOf(
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
    @PostMapping("\${api.path}/delivery_points")
    @ResponseBody
    fun addDeliveryPoint(@RequestBody deliveryPoint: DeliveryPoint): ResponseEntity<EntityCreatedResponse<Int>> {
        try {
            val createdEntity = deliveryPointRepo.save(deliveryPoint)

            return ResponseEntity(EntityCreatedResponse(createdEntity.id), HttpStatus.CREATED)
        } catch (_: IllegalArgumentException) {
            throw BadEntityException("entity was empty")
        }
    }

    @Operation(summary = "Get delivery point", parameters = [Parameter(name = "id", `in` = ParameterIn.PATH)])
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully get delivery point", content = arrayOf(
                    Content(
                        mediaType = "application/json", schema = Schema(implementation = DeliveryPoint::class)
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
                description = "In case if delivery point is not found",
                content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "500", description = "Internal error", content = arrayOf(Content()),
            )
        ]
    )
    @GetMapping("\${api.path}/delivery_points/{id}")
    @ResponseBody
    fun getDeliveryPoint(@PathVariable id: Int): DeliveryPoint {
        val deliveryPoint = deliveryPointRepo.findById(id)

        if (deliveryPoint.isEmpty) {
            throw EntityNotFoundException()
        }

        return deliveryPoint.get()
    }

    @Operation(summary = "Delete delivery point", parameters = [Parameter(name = "id", `in` = ParameterIn.PATH)])
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully deleting delivery point", content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "204", description = "If delivery point was deleted before", content = arrayOf(Content())
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
    @DeleteMapping("\${api.path}/delivery_points/{id}")
    fun deleteDeliveryPoint(@PathVariable id: Int): ResponseEntity<String> {
        val deliveryPoint = deliveryPointRepo.findById(id)
        if (deliveryPoint.isPresent) {
            deliveryPointRepo.deleteById(id)
            return ResponseEntity(HttpStatus.OK)
        }

        return ResponseEntity(HttpStatus.NO_CONTENT)
    }

    @Operation(summary = "Update delivery point")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully updating delivery point",
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
    @PutMapping("\${api.path}/delivery_points")
    @ResponseBody
    fun updateDeliveryPoint(
        @RequestBody deliveryPoint: DeliveryPoint,
    ) {
        try {
            deliveryPointRepo.save(deliveryPoint)
        } catch (_: IllegalArgumentException) {
            throw BadEntityException("entity was empty")
        }
    }

    @Operation(summary = "Get all delivery point types")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully getting all delivery point types",
                content = arrayOf(
                    Content(
                        mediaType = "application/json",
                        array = ArraySchema(schema = Schema(implementation = String::class))
                    ),
                )
            ),
            ApiResponse(
                responseCode = "404", description = "No such factory was found", content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "500", description = "Internal error", content = arrayOf(Content()),
            )
        ]
    )
    @GetMapping("\${api.path}/delivery_points/types")
    @ResponseBody
    fun getDeliveryPointTypes(): List<String> {
        val deliveryPointTypes = deliveryPointTypeRepo.findAll().toList().map { it.name }

        if (deliveryPointTypes.isEmpty()) {
            throw EntityNotFoundException("delivery point types")
        }

        return deliveryPointTypes
    }
}