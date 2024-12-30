package space.arlet.course4backend.repo

import org.springframework.data.jpa.repository.JpaRepository
import space.arlet.course4backend.core.Delivery
import space.arlet.course4backend.core.Factory

interface DeliveryRepo : JpaRepository<Delivery, Int> {
    fun findAllByFactory(factory: Factory): List<Delivery>
}