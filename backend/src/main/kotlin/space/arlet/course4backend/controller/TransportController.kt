package space.arlet.course4backend.controller

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.enums.ParameterIn
import io.swagger.v3.oas.annotations.media.ArraySchema
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import space.arlet.course4backend.controller.filters.RangeFilter
import space.arlet.course4backend.controller.responses.EntityCreatedResponse
import space.arlet.course4backend.core.Transport
import space.arlet.course4backend.exceptions.BadEntityException
import space.arlet.course4backend.exceptions.EntityExistsException
import space.arlet.course4backend.exceptions.EntityNotFoundException
import space.arlet.course4backend.repo.TransportRepo

@RestController
class TransportController @Autowired constructor(
    private val transportRepo: TransportRepo,
    private val rangeFilter: RangeFilter,
) {
    private val logger = LoggerFactory.getLogger("application")

    @Operation(summary = "Get all transports")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully getting all transports",
                content = arrayOf(
                    Content(
                        mediaType = "application/json",
                        array = ArraySchema(schema = Schema(implementation = Transport::class))
                    ),
                )
            ),
            ApiResponse(
                responseCode = "404", description = "No such transport was found", content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "500", description = "Internal error", content = arrayOf(Content()),
            )
        ]
    )
    @GetMapping("\${api.path}/transports")
    @ResponseBody
    fun getTransports(
        @RequestParam(name = "packs_capacity_greater", required = false) greaterPacksCapacity: Int?,
        @RequestParam(name = "packs_capacity_greater_eq", required = false) greaterEqPacksCapacity: Int?,
        @RequestParam(name = "packs_capacity_less", required = false) lessPacksCapacity: Int?,
        @RequestParam(name = "packs_capacity_less_eq", required = false) lessEqPacksCapacity: Int?,
        @RequestParam(name = "packs_capacity_eq", required = false) eqPacksCapacity: Int?,
        @RequestParam(name = "max_weight_greater", required = false) greaterMaxWeight: Double?,
        @RequestParam(name = "max_weight_greater_eq", required = false) greaterEqMaxWeight: Double?,
        @RequestParam(name = "max_weight_less", required = false) lessMaxWeight: Double?,
        @RequestParam(name = "max_weight_less_eq", required = false) lessEqMaxWeight: Double?,
        @RequestParam(name = "max_weight_eq", required = false) eqMaxWeight: Double?,
    ): List<Transport> {
        logger.debug("start getting transports")

        val transports = transportRepo.findAll().toList().filter {
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
            if (!rangeFilter.inRange(
                    it.maxWeight,
                    greaterMaxWeight,
                    greaterEqMaxWeight,
                    lessMaxWeight,
                    lessEqMaxWeight,
                    eqMaxWeight,
                )
            )
                return@filter false
            return@filter true

        }.sortedBy { it.transportNumber }

        if (transports.isEmpty()) {
            throw EntityNotFoundException("transports")
        }

        return transports
    }

    @Operation(summary = "Add transport")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "201",
                description = "Successfully creating transport",
                content = arrayOf(
                    Content(
                        mediaType = "application/json",
                        schema = Schema(implementation = EntityCreatedResponse::class)
                    )
                )
            ),
            ApiResponse(
                responseCode = "208",
                description = "Transport already exists",
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
    @PostMapping("\${api.path}/transports")
    @ResponseBody
    fun addTransport(@RequestBody transport: Transport): ResponseEntity<EntityCreatedResponse<String>> {
        logger.debug("start adding transports")

        if (transport.transportNumber == "")
            throw BadEntityException("transport number must be not empty")
        if (transportRepo.existsById(transport.transportNumber))
            throw EntityExistsException()
        try {
            val createdEntity = transportRepo.save(transport)

            return ResponseEntity(EntityCreatedResponse(createdEntity.transportNumber), HttpStatus.CREATED)
        } catch (_: IllegalArgumentException) {
            throw BadEntityException("entity was empty")
        }
    }

    @Operation(summary = "Get transport", parameters = [Parameter(name = "number", `in` = ParameterIn.PATH)])
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully get transport", content = arrayOf(
                    Content(
                        mediaType = "application/json", schema = Schema(implementation = Transport::class)
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
                description = "In case if transport is not found",
                content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "500", description = "Internal error", content = arrayOf(Content()),
            )
        ]
    )
    @GetMapping("\${api.path}/transports/{number}")
    @ResponseBody
    fun getTransport(@PathVariable number: String): Transport {
        logger.debug("start getting transport")

        val transport = transportRepo.findById(number)

        if (transport.isEmpty) {
            throw EntityNotFoundException()
        }

        return transport.get()
    }

    @Operation(summary = "Delete transport", parameters = [Parameter(name = "number", `in` = ParameterIn.PATH)])
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully deleting transport", content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "204", description = "If transport was deleted before", content = arrayOf(Content())
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
    @DeleteMapping("\${api.path}/transports/{number}")
    fun deleteTransport(@PathVariable number: String): ResponseEntity<String> {
        logger.debug("start deleting transport")

        if (transportRepo.existsById(number)) {
            transportRepo.deleteById(number)
            return ResponseEntity(HttpStatus.OK)
        }

        return ResponseEntity(HttpStatus.NO_CONTENT)
    }

    @Operation(summary = "Update transport")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully updating transport",
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
    @PutMapping("\${api.path}/transports")
    @ResponseBody
    fun updateTransport(
        @RequestBody transport: Transport
    ) {
        logger.debug("start updating transport")

        try {
            transportRepo.save(transport)
        } catch (_: IllegalArgumentException) {
            throw BadEntityException("entity was empty")
        }
    }
}