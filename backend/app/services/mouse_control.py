import pyautogui
import time
import math

class MouseController:
    def __init__(self):
        pyautogui.FAILSAFE = False
        self.screen_width, self.screen_height = pyautogui.size()
        self.last_update = time.time()
        self.min_update_interval = 1/60  # 60fps
        self.last_position = None
        self.movement_buffer = {'x': 0, 'y': 0}

    def move_cursor(self, dx: float, dy: float, sensitivity: float):
        current_time = time.time()
        
        # Rate limiting
        if current_time - self.last_update < self.min_update_interval:
            # Buffer the movement
            self.movement_buffer['x'] += dx
            self.movement_buffer['y'] += dy
            return

        # Get current position
        current_x, current_y = pyautogui.position()
        
        # Add buffered movement
        dx += self.movement_buffer['x']
        dy += self.movement_buffer['y']
        self.movement_buffer = {'x': 0, 'y': 0}  # Reset buffer

        # Apply non-linear sensitivity with dead zone
        DEAD_ZONE = 0.5
        if abs(dx) < DEAD_ZONE: dx = 0
        if abs(dy) < DEAD_ZONE: dy = 0
        
        # Non-linear sensitivity curve
        sensitivity_factor = (sensitivity ** 2) / 100
        dx = math.copysign(abs(dx) ** 1.5, dx) * sensitivity_factor
        dy = math.copysign(abs(dy) ** 1.5, dy) * sensitivity_factor

        # Calculate new position
        new_x = current_x + dx
        new_y = current_y + dy

        # Screen boundary check with margin
        margin = 2
        new_x = max(margin, min(new_x, self.screen_width - margin))
        new_y = max(margin, min(new_y, self.screen_height - margin))

        # Move cursor with smoothing
        pyautogui.moveTo(new_x, new_y, duration=0.01)  # Small duration for smoothing
        self.last_update = current_time

    def scroll(self, dy: float, sensitivity: float):
        current_time = time.time()
        
        # Rate limiting
        if current_time - self.last_update < self.min_update_interval:
            self.movement_buffer['y'] += dy
            return

        # Add buffered movement
        dy += self.movement_buffer['y']
        self.movement_buffer = {'x': 0, 'y': 0}  # Reset buffer

        # Apply dead zone
        SCROLL_DEAD_ZONE = 1.0
        if abs(dy) < SCROLL_DEAD_ZONE:
            return

        # Non-linear sensitivity for scrolling
        sensitivity_factor = (sensitivity ** 2) / 200  # Reduced sensitivity for scrolling
        scroll_amount = int(math.copysign(abs(dy) ** 1.5, dy) * sensitivity_factor)

        pyautogui.scroll(scroll_amount)
        self.last_update = current_time 