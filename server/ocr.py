import os

# draw result
from PIL import Image
from paddleocr import PaddleOCR, draw_ocr

# Paddleocr supports Chinese, English, French, German, Korean and Japanese.
# You can set the parameter `lang` as `ch`, `en`, `fr`, `german`, `korean`, `japan`
# to switch the language model in order.

os.environ['KMP_DUPLICATE_LIB_OK'] = "True"

# need to run only once to download and load model into memory
ocr = PaddleOCR(use_angle_cls=True, lang='ch', use_gpu=False)

img_path = '../electron/cap.png'
result = ocr.ocr(img_path, cls=True)
for line in result:
    print(line)

image = Image.open(img_path).convert('RGB')
boxes = [line[0] for line in result]
txts = [line[1][0] for line in result]
scores = [line[1][1] for line in result]
im_show = draw_ocr(image, boxes, txts, scores, font_path='./fonts/simfang.ttf')
# im_show = draw_structure_result(image, result, font_path='./fonts/simfang.ttf')
im_show = Image.fromarray(im_show)
im_show.save('result.jpg')

print('*' * 20)
print(txts)
