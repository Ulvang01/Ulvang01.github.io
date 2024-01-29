import * as THREE from 'three';

export function checkCollision(object1, object2) {
    // Get the bounding boxes of the objects
    const box1 = new THREE.Box3().setFromObject(object1);
    const box2 = new THREE.Box3().setFromObject(object2);

    // Check for collision
    return box1.intersectsBox(box2);
}
