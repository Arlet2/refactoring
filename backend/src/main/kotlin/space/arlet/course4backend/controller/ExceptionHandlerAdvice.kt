package space.arlet.course4backend.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException
import space.arlet.course4backend.exceptions.EntityNotFoundException

@ControllerAdvice
class ExceptionHandlerAdvice {
    @ExceptionHandler(value = [MethodArgumentTypeMismatchException::class, HttpMessageNotReadableException::class])
    fun handleRequestException(e: Exception): ResponseEntity<String> {
        return ResponseEntity(e.message, HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(value = [EntityNotFoundException::class])
    fun handleEntityNotFoundException(e: EntityNotFoundException): ResponseEntity<String> {
        return ResponseEntity("no any ${e.entityName} was found", HttpStatus.NOT_FOUND)
    }
}