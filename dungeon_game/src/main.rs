use std::cmp::{min, max};

/// Calculates the minimum initial health required for the knight
/// to rescue the princess from the bottom-right of the dungeon.
pub fn calculate_minimum_hp(dungeon: Vec<Vec<i32>>) -> i32 {
    let row_count = dungeon.len();
    let col_count = dungeon[0].len();

    let mut health_matrix = vec![vec![i32::MAX; col_count + 1]; row_count + 1];

    health_matrix[row_count][col_count - 1] = 1;
    health_matrix[row_count - 1][col_count] = 1;

    for row in (0..row_count).rev() {
        for col in (0..col_count).rev() {
            let min_health_after_move = min(
                health_matrix[row + 1][col],
                health_matrix[row][col + 1],
            );

            let required_health = min_health_after_move.saturating_sub(dungeon[row][col]);
            health_matrix[row][col] = max(1, required_health);
        }
    }

    health_matrix[0][0]
}

fn main() {
    let dungeon = vec![
        vec![-2, -3, 3],
        vec![-5, -10, 1],
        vec![10, 30, -5],
    ];

    let result = calculate_minimum_hp(dungeon);
    println!("Minimum required initial life: {}", result);
}