
# Convolution Kernel Gradient Calculation

## Key Idea with 2 different wordings

-  Kernel inputs multiplied with result feature vector derivatives gives us kernel derivative to total loss
- In short he kernel gradient is found by summing the patches that produced the outputs, weighted by how important those outputs were.


## Start with this 

-  [Best Video](https://www.youtube.com/watch?v=z9hJzduHToc)
-  [Video as Miro Diagram](https://miro.com/app/board/uXjVIYa0oMo=/?share_link_id=877962336717)

## NB! 

- If stride was 1, the  output gradient tensor will be applied to image directly as a convolution. Example [course jupyter notebook](https://colab.research.google.com/drive/1axNGtjRcCqwjoge6dBk4YnH9zIPO7hOC) NB the proposed method works only with stride 1 with any other stride it does not. 
- If stride was 2, the output gradient will be dilated and then applied to input tensor.




