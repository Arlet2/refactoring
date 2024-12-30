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
import space.arlet.course4backend.controller.responses.EntityCreatedResponse
import space.arlet.course4backend.core.Factory
import space.arlet.course4backend.exceptions.BadEntityException
import space.arlet.course4backend.exceptions.EntityNotFoundException
import space.arlet.course4backend.repo.DeliveryRepo
import space.arlet.course4backend.repo.FactoryRepo

@RestController
class FactoryController @Autowired constructor(
    private val factoryRepo: FactoryRepo,
    private val deliveryRepo: DeliveryRepo,
) {
    @Operation(summary = "Get all factories")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully getting all factories",
                content = arrayOf(
                    Content(
                        mediaType = "application/json",
                        array = ArraySchema(schema = Schema(implementation = Factory::class))
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
    @GetMapping("\${api.path}/factories")
    @ResponseBody
    fun getFactories(): List<Factory> {
        val factories = factoryRepo.findAll().toList().sortedBy { it.id }

        if (factories.isEmpty()) {
            throw EntityNotFoundException("factories")
        }

        return factories
    }

    @Operation(summary = "Add factory")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "201",
                description = "Successfully creating factory",
                content = arrayOf(
                    Content(
                        mediaType = "application/json",
                        schema = Schema(implementation = EntityCreatedResponse::class)
                    )
                )
            ),
            ApiResponse(
                responseCode = "208",
                description = "Factory already exists",
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
    @PostMapping("\${api.path}/factories")
    @ResponseBody
    fun addFactory(@RequestBody factory: Factory): ResponseEntity<EntityCreatedResponse<Int>> {
        try {
            val createdEntity = factoryRepo.save(factory)

            return ResponseEntity(EntityCreatedResponse(createdEntity.id), HttpStatus.CREATED)
        } catch (_: IllegalArgumentException) {
            throw BadEntityException("entity was empty")
        }
    }

    @Operation(summary = "Get factory", parameters = [Parameter(name = "id", `in` = ParameterIn.PATH)])
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully get factory", content = arrayOf(
                    Content(
                        mediaType = "application/json", schema = Schema(implementation = Factory::class)
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
                description = "In case if factory is not found",
                content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "500", description = "Internal error", content = arrayOf(Content()),
            )
        ]
    )
    @GetMapping("\${api.path}/factories/{id}")
    @ResponseBody
    fun getFactory(@PathVariable id: Int): Factory {
        val factory = factoryRepo.findById(id)

        if (factory.isEmpty) {
            throw EntityNotFoundException()
        }

        return factory.get()
    }

    @Operation(summary = "Delete factory", parameters = [Parameter(name = "id", `in` = ParameterIn.PATH)])
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Successfully deleting factory", content = arrayOf(Content())
            ),
            ApiResponse(
                responseCode = "204", description = "If factory was deleted before", content = arrayOf(Content())
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
    @DeleteMapping("\${api.path}/factories/{id}")
    fun deleteFactory(@PathVariable id: Int): ResponseEntity<String> {
        val factory = factoryRepo.findById(id)
        if (factory.isPresent) {
            deliveryRepo.findAllByFactory(factory.get()).forEach {
                val newDelivery = it.copy(factory = null)
                deliveryRepo.save(newDelivery)
            }
            factoryRepo.deleteById(id)
            return ResponseEntity(HttpStatus.OK)
        }

        return ResponseEntity(HttpStatus.NO_CONTENT)
    }

    @Operation(summary = "Update factory")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Successfully updating factory",
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
    @PutMapping("\${api.path}/factories")
    @ResponseBody
    fun updateFactory(
        @RequestBody factory: Factory
    ) {
        try {
            factoryRepo.save(factory)
        } catch (_: IllegalArgumentException) {
            throw BadEntityException("entity was empty")
        }
    }
}