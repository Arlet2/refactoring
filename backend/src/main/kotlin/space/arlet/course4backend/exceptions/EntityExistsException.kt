package space.arlet.course4backend.exceptions

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(value = HttpStatus.ALREADY_REPORTED)
class EntityExistsException : RuntimeException()