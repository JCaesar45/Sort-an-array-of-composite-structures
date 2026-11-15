from dataclasses import dataclass
from statistics import mean, pstdev


@dataclass(frozen=True)
class Sale:
    sku: str
    units: int
    price: float


def revenue(sales):
    return sum(s.units * s.price for s in sales)


def zscores(values):
    mu, sd = mean(values), pstdev(values)
    return [0.0 if sd == 0 else (v - mu) / sd for v in values]


def flag_outliers(sales, cutoff=2.0):
    scores = zscores([s.units for s in sales])
    return [s.sku for s, z in zip(sales, scores) if abs(z) >= cutoff]


if __name__ == "__main__":
    data = [
        Sale("noir", 12, 340), Sale("ambre", 15, 295), Sale("rose", 14, 310),
        Sale("noir", 11, 340), Sale("ambre", 90, 295), Sale("rose", 13, 310),
    ]
    print(f"revenue: ${revenue(data):,.2f}")
    print("outliers:", flag_outliers(data))
