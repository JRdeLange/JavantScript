export default class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // Rotate the vector by a given angle in radians
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        return new Vec2(x, y);
    }

    // Multiply the vector by a scalar value
    multiply(scalar) {
        const x = this.x * scalar;
        const y = this.y * scalar;
        return new Vec2(x, y);
    }

    // Add another vector to the current vector
    add(vector) {
        const x = this.x + vector.x;
        const y = this.y + vector.y;
        return new Vec2(x, y);
    }

    // Subtract another vector from the current vector
    subtract(vector) {
        const x = this.x - vector.x;
        const y = this.y - vector.y;
        return new Vec2(x, y);
    }

    // Divide the vector by a scalar value
    divide(scalar) {
        const x = this.x / scalar;
        const y = this.y / scalar;
        return new Vec2(x, y);
    }

    // Calculate the magnitude (length) of the vector
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    // Normalize the vector (convert to unit vector)
    normalize() {
        const magnitude = this.magnitude();
        if (magnitude === 0) {
            return new Vec2();
        }
        return this.divide(magnitude);
    }

    // Create a vector from a given angle in radians
    static fromRadians(angle) {
        const x = Math.cos(angle);
        const y = Math.sin(angle);
        return new Vec2(x, y);
    }

    // Convert the vector to an angle in radians
    toRadians() {
            return Math.atan2(this.y, this.x);
    }

    // Return a copy of the vector
    clone() {
        return new Vec2(this.x, this.y);
    }

    // Find the angle from this vector to another vector
    angleTo(vector) {
        const thisAngle = this.toRadians();
        const otherAngle = vector.toRadians();
        let angle = otherAngle - thisAngle;

        if (angle > Math.PI) {
            angle -= 2 * Math.PI;
        } else if (angle < -Math.PI) {
            angle += 2 * Math.PI;
        }

        return angle;
    }
}
    

    