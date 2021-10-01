import os

import cv2
from PIL import Image
from paddleocr import PPStructure, draw_structure_result, save_structure_res

os.environ['KMP_DUPLICATE_LIB_OK'] = "True"
table_engine = PPStructure(show_log=True, use_gpu=False)

save_folder = './output/table'
img_path = '../electron/cap.png'
img = cv2.imread(img_path)
result = table_engine(img)
save_structure_res(result, save_folder, os.path.basename(img_path).split('.')[0])
print('*' * 20)
print(result)
for line in result:
    line.pop('img')
    print(line)

print('*' * 20)
result_dict = result[0]

for key, value in dict(result_dict).items():
    print(key, value)

print('')
for i in result_dict['res']:
    print(i)

print('*' * 15 + 'print text')
text = result_dict['res'][1]
for t in text:
    print(t[0])

font_path = './fonts/simfang.ttf'
image = Image.open(img_path).convert('RGB')
im_show = draw_structure_result(image, result, font_path=font_path)
im_show = Image.fromarray(im_show)
im_show.save('result.jpg')
