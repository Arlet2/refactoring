package space.arlet.course4backend.core

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

@Entity
@Table(name = "pelmeni_conveyors")
data class ConveyorPelmeni(
    @Id
    @ManyToOne
    val conveyor: Conveyor,
    @Id
    @ManyToOne
    val type: PelmeniType,
    @Id
    @ManyToOne
    val sizeName: PelmeniSize,
)