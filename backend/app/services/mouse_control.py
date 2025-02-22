import pyautogui
import time

class MouseController:
    def __init__(self):
        pyautogui.FAILSAFE = False
        self.screen_width, self.screen_height = pyautogui.size()
        self.last_update = time.time()
        self.min_update_interval = 1/60  # Limit to 60 updates per second

    def move_cursor(self, dx: float, dy: float, sensitivity: float):
        current_time = time.time()
        
        # Rate limiting
        if current_time - self.last_update < self.min_update_interval:
            return
            
        current_x, current_y = pyautogui.position()
        
        # Apply non-linear sensitivity
        sensitivity_factor = (sensitivity ** 2) / 100
        new_x = current_x + (dx * sensitivity_factor)
        new_y = current_y + (dy * sensitivity_factor)
        
        # Ensure coordinates stay within screen bounds
        new_x = max(0, min(new_x, self.screen_width))
        new_y = max(0, min(new_y, self.screen_height))
        
        # Move cursor
        pyautogui.moveTo(new_x, new_y)
        self.last_update = current_time

    def scroll(self, dy: float, sensitivity: float):
        current_time = time.time()
        
        # Rate limiting
        if current_time - self.last_update < self.min_update_interval:
            return
            
        # Apply sensitivity for scrolling
        scroll_amount = int(dy * sensitivity / 10)  # Reduced sensitivity for scrolling
        
        # Add deadzone for scrolling
        if abs(scroll_amount) > 1:
            pyautogui.scroll(scroll_amount)
            
        self.last_update = current_time 