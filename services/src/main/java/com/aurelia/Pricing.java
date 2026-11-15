package com.aurelia;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Pricing {
    record Item(String sku, int qty, double price) {}

    static double subtotal(List<Item> items) {
        return items.stream().mapToDouble(i -> i.qty() * i.price()).sum();
    }

    static double discount(double subtotal) {
        if (subtotal >= 1000) return 0.10;
        if (subtotal >= 600) return 0.05;
        return 0.0;
    }

    static Map<String, Integer> unitsBySku(List<Item> items) {
        return items.stream().collect(Collectors.groupingBy(Item::sku, Collectors.summingInt(Item::qty)));
    }

    public static void main(String[] args) {
        List<Item> cart = List.of(new Item("noir", 2, 340), new Item("rose", 1, 310));
        double sub = subtotal(cart);
        double total = sub * (1 - discount(sub));
        System.out.printf("subtotal=%.2f total=%.2f units=%s%n", sub, total, unitsBySku(cart));
    }
}
