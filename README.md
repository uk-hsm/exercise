# exercise
# This repository merely serves exercising purposes.
#
#
# File 'ants.js':
# 
# This is an implementation of Multiple Langton's Ants.
# Run this file as follows:
# 
# $ node ants.js <numberOfSteps> <jsonInitFile>
# 
# If the <numberOfSteps> is negative, verbose mode is enabled.
# The output file is called 'finalstate.json' and it is created
# in the current directory, overwriting a previous file of that
# name if present.
#
# Possible future improvements:
# (*) The for-loop that shifts the origin of the coordinate system
#     is carried out regardless of whether such a shift really
#     is needed or not. It would be better to perform the loop only
#     conditionally.
# (*) The playing field is stored twice, once as the playingfield
#     array and once as the set of all black points. This redundancy
#     is inefficient.
# (*) Implement advanced tests with respect to the input parameters.
# (*) Check the code with respect to best practices. In particular:
#     Asynchronous file reading, callbacks and the like.

