package space.arlet.course4backend.controller.filters

import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class DateFilter {
    fun isDateValid(
        date: LocalDateTime?,
        beforeRestriction: LocalDateTime?,
        afterRestriction: LocalDateTime?,
        onRestriction: LocalDateTime?,
    ): Boolean {
        if (date != null) {
            if (beforeRestriction != null)
                if (!date.isBefore(beforeRestriction))
                    return false
            if (afterRestriction != null)
                if (!date.isAfter(afterRestriction))
                    return false
            if (onRestriction != null)
                if (!date.isEqual(onRestriction))
                    return false
            return true
        }
        return beforeRestriction == null && afterRestriction == null && onRestriction == null
    }
}