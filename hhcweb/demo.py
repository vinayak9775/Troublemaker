
# a=[1,2,3,4,5,6,7,8,9,10]
# b=['1','2','3','4','5','6','7','8','9','10']
# d=[10,9,8,7,6,5,4,3,2,1]
# c=[10,9,8,7,6,5,4,3,2,1]
# # print(list(zip(b,a,d,c)))
    
    
# def cu_zip(*lists):
#     data=[j[i] for i in range(min(list(map(lambda x:len(x),lists)))) for j in lists]
#     # dd=[data[i:i+len(lists)] for i in range(0,len(lists),4)]
#     # print(dd)
#     print(data)
#     print(list(map(lambda x:len(x),lists)))
# cu_zip(a,b,c,d)




# nums1=[10,9,3,2,1]
# nums2=[11,9,6,3,1]

# 
# nums1=[1,2,3,0,0,0]
# nums2=[2,5,6]
# k=nums1+nums2
# for i in range(len(k)-1):
#     for j in range(len(k)-i-1):
#         if k[j]>k[j+1]:
#             k[j],k[j+1]=k[j+1],k[j]

# print(k)
        



# def merge(self,nums1, m, nums2, n):
#         """
#         :type nums1: List[int]
#         :type m: int
#         :type nums2: List[int]
#         :type n: int
#         :rtype: None Do not return anything, modify nums1 in-place instead.
#         """
        
#         l=[self.nums1[i] for i in range(0,m)]
#         m=[self.nums2[i] for i in range(0,n)]
#         # print(m)
#         k=l+m
#         # print(k)
#         for i in range(len(k)-1):
#             for j in range(len(k)-i-1):
#                 if k[j]>k[j+1]:
#                     k[j],k[j+1]=k[j+1],k[j]
        
#         return k

# print(merge(nums1,3,nums2,3))
# print(sorted(k))

# d=[]
# for i in range(0,len(k)):
#     if k[i] in d:
#         d.insert(i+1,k[i])
#     elif k[i] >
#     else:
#         d.append(k[i])
        
# print(sorted(k))





# a = 10
# print(a)

# a < 11 = true
# None = print('eleven')
# None == False
# and = True| True
# a < 11 and print('eleven')

    # print('b')
# else:
#     print('c')


# nums=[1,3,5,6]
# target = 0


# for i in range(len(nums)):
#     # print(len(nums)-1)
#     if target in nums:
#         if nums[i] == target:
#             print(i)
#             break
#     else:
#         if target==0:
#             print(0)
#         elif nums[i]> target and nums[i-1]<target:
#             print(i)
#             break
#         elif nums[i]< target and (len(nums)-1)== i:
#             print(i+1)
#             break
    
# for i in nums:
#     if target == i:
#         if target in nums:
#             return index(i)
#     elif target not in nums:
#         if i > target and i-1 < target:
#             return index(i)



d = (i for i in range(10))
print(next(d))
print(next(d))
print(next(d))