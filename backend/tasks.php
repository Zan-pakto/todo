<?php
require_once 'config.php';

// Get all tasks
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query('SELECT * FROM tasks ORDER BY created_at DESC');
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($tasks);
}

// Create a new task
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $title = $data['title'];
    $description = $data['description'] ?? '';
    
    $stmt = $pdo->prepare('INSERT INTO tasks (title, description, completed) VALUES (?, ?, 0)');
    $stmt->execute([$title, $description]);
    
    $taskId = $pdo->lastInsertId();
    $stmt = $pdo->query("SELECT * FROM tasks WHERE id = $taskId");
    $task = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode($task);
}

// Update a task
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'];
    $title = $data['title'] ?? null;
    $description = $data['description'] ?? null;
    $completed = $data['completed'] ?? null;
    
    $updates = [];
    $params = [];
    
    if ($title !== null) {
        $updates[] = 'title = ?';
        $params[] = $title;
    }
    if ($description !== null) {
        $updates[] = 'description = ?';
        $params[] = $description;
    }
    if ($completed !== null) {
        $updates[] = 'completed = ?';
        $params[] = $completed;
    }
    
    if (!empty($updates)) {
        $params[] = $id;
        $sql = 'UPDATE tasks SET ' . implode(', ', $updates) . ' WHERE id = ?';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        $stmt = $pdo->query("SELECT * FROM tasks WHERE id = $id");
        $task = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($task);
    }
}

// Delete a task
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'];
    $stmt = $pdo->prepare('DELETE FROM tasks WHERE id = ?');
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
}
?> 