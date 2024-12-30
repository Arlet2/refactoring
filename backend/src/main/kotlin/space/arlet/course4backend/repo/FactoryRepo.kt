package space.arlet.course4backend.repo

import org.springframework.data.repository.CrudRepository
import space.arlet.course4backend.core.Factory

interface FactoryRepo : CrudRepository<Factory, Int>