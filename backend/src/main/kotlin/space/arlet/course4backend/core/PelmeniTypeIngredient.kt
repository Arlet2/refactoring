package space.arlet.course4backend.core

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import jakarta.validation.constraints.Max

/***
 * PelmeniTypeIngredient характеризует ингредиент, необходимый для приготовления пельменей в одной партии
 */
@Entity
@Table(name = "pelmeni_type_ingredients")
data class PelmeniTypeIngredient(
    @Id
    @ManyToOne
    val type: PelmeniType,

    @Id
    val ingredientName: String,

    @Max(value = 1000000)
    // In g
    val weight: Double,
)