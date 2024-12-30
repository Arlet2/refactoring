package space.arlet.course4backend.repo

import org.springframework.data.repository.CrudRepository
import space.arlet.course4backend.core.DeliveryPointType

interface DeliveryPointTypeRepo : CrudRepository<DeliveryPointType, String>