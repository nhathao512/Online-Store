package com.project.shopapp.repositories;

import com.project.shopapp.models.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    boolean existsByUserIdAndProductId(Long userId, Long productId);
    Favorite findByUserIdAndProductId(Long userId, Long productId);
}


