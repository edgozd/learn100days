# study quickx in w3schools

# ==========================================
# 1. LIST (DANH SÁCH) - Có thể thay đổi (Mutable)
# ==========================================
print("--- VÍ DỤ VỀ LIST ---")
my_list = [10, 20, 30, "Python", True]

# Truy cập phần tử
print("Phần tử đầu tiên:", my_list[0])      # 10
print("Phần tử cuối cùng:", my_list[-1])    # True

# Slicing (Cắt list)
print("Slicing từ index 1 đến 3:", my_list[1:4])  # [20, 30, 'Python']

# Thay đổi giá trị phần tử
my_list[1] = 99
print("Sau khi thay đổi index 1:", my_list)

# Thêm, chèn, xóa phần tử
my_list.append("Mới")       # Thêm vào cuối
my_list.insert(2, "Chèn")   # Chèn vào index 2
my_list.remove("Python")    # Xóa giá trị "Python"
last_item = my_list.pop()   # Lấy và xóa phần tử cuối cùng

print("List sau các thao tác:", my_list)
print("Phần tử vừa lấy ra (pop):", last_item)

# ==========================================
# 2. TUPLE (BỘ GIÁ TRỊ) - Bất biến (Immutable)
# ==========================================
print("\n--- VÍ DỤ VỀ TUPLE ---")
my_tuple = (10, 20, 30, "Python")

# Truy cập và Slicing (Giống List)
print("Phần tử thứ 2:", my_tuple[1])
print("Slicing từ 1 đến 2:", my_tuple[1:3])

# Unpacking (Mở gói Tuple)
a, b, c, d = my_tuple
print(f"Unpacking: a={a}, b={b}, c={c}, d={d}")

# Tuple Methods
print("Số lần xuất hiện của 20:", my_tuple.count(20))
print("Vị trí (index) của 30:", my_tuple.index(30))

# ==========================================
# 3. THAO TÁC CHUNG CHO SEQUENCES (List, Tuple)
# ==========================================
print("\n--- THAO TÁC CHUNG ---")
list_a = [1, 2, 3]
tuple_a = (4, 5, 6)

print("Độ dài của list_a:", len(list_a))
print("Nối 2 list:", list_a + [7, 8])
print("Kiểm tra 2 có trong list_a không:", 2 in list_a)
print("Nhân bản tuple_a 2 lần:", tuple_a * 2)

