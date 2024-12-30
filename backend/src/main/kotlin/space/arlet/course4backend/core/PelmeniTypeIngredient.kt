package space.arlet.course4backend.core

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

@Entity
@Table(name = "pelmeni_type_ingredients")
data class PelmeniTypeIngredient(
    @Id
    @ManyToOne
    val type: PelmeniType,
    @Id val ingredientName: String,
    val weight: Double,
)