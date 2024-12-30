package space.arlet.course4backend

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.fail
import org.springframework.boot.test.context.SpringBootTest
import java.time.format.DateTimeFormatter
import java.util.*

@SpringBootTest
class Test {
    @Test
    fun test1() {
        val format = DateTimeFormatter.ISO_DATE


        fail(Date().toString())
    }
}