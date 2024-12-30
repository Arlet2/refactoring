package space.arlet.course4backend.exceptions

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(value = HttpStatus.NOT_FOUND)
class EntityNotFoundException(val entityName: String) : RuntimeException() {
    constructor() : this("entity")
}