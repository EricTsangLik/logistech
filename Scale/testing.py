def extract_float_values(lst):
    float_values = []
    current_value = ""

    for item in lst:
        if isinstance(item, str) and item.isdigit():
            current_value += item
        elif isinstance(item, str) and item == '.':
            current_value += item
        elif isinstance(item, str) and (item.lower() == 'k' or item.lower() == 'g'):
            current_value += '0'
        else:
            if current_value:
                try:
                    float_value = float(current_value)
                    float_values.append(float_value)
                except ValueError:
                    pass
            current_value = ""

    if current_value:
        try:
            float_value = float(current_value)
            float_values.append(float_value)
        except ValueError:
            pass

    return float_values

# Example usage
lst = ['0', '.', '0', 'k', 'g', '4', '.', '0', 'k', 'g', '4', '.', '0', 'k', 'g', '5', '.', '0', 'k', 'g', '0', '.', '0', 'k', 'g']
result = extract_float_values(lst)
print(result)
